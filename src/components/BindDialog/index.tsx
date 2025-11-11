import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import type { Provider } from '@reown/appkit-adapter-solana';
import { Loader2 } from 'lucide-react';

import BindBtnBg from './bind-btn-bg.svg?react';
import CancelBtnBg from './cancel-btn-bg.svg?react';
import PasteIcon from './paste-icon.svg?react';

import BaseChainIcon from '@/assets/chain-base-icon.svg?react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import useBindDialogOpenStatusStore from '@/store/useBindDialogOpenStatusStore';
import ENDPOINTS from '@/api';
import { useBoundedBaseAddress } from '@/hooks/useBoundedBaseAddress';
import { getAssociatedTokenAddress } from '@/utils/solana';
import config from '@/config';

function BindDialog() {
  const { open, setOpen } = useBindDialogOpenStatusStore();
  const [baseAddress, setBaseAddress] = useState('');
  const [isBinding, setIsBinding] = useState(false);
  const { address: solanaAddress } = useAppKitAccount({ namespace: 'solana' });
  const { walletProvider } = useAppKitProvider<Provider>('solana');
  const handlePaste = async () => {
    const clipboardData = await navigator.clipboard.readText();
    setBaseAddress(clipboardData);
  };

  const { refetch } = useBoundedBaseAddress();

  useEffect(() => {
    if (!open) {
      setBaseAddress('');
    }
  }, [open]);

  const handleBind = async () => {
    try {
      setIsBinding(true);
      const res = await fetch(ENDPOINTS.getSignMessage, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: baseAddress }),
      });
      const data = await res.json();
      if (data.code === 0) {
        const message = data.data.message;
        // solana wallet
        const encodedMessage = new TextEncoder().encode(message);
        const bufferSignature =
          await walletProvider.signMessage(encodedMessage);
        const signature = Buffer.from(bufferSignature).toString('base64');
        const res = await fetch(ENDPOINTS.bindBaseAddress, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address: solanaAddress,
            ata_address:
              config.SVM_NETWORK === 'solana-devnet'
                ? solanaAddress
                : getAssociatedTokenAddress(
                    solanaAddress!,
                    config.SOLANA_USDC_ADDRESS
                  ),
            signature,
            message,
          }),
        });
        const loginRes = await res.json();
        if (loginRes.code === 0) {
          await refetch();
          setOpen(false);
          toast.success('Bind success');
        } else {
          toast.error(loginRes.message ?? 'Failed to bind.');
        }
      } else {
        toast.error(data.message ?? 'Failed to get sign message.');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsBinding(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        hideCloseButton
        className="w-[390px] rounded-[60px] border-white/10 bg-gradient-to-b from-[#292929] to-[#1C1C1C] shadow-[0_0_60px_0_rgba(0,0,0,0.80)]"
      >
        <DialogHeader className="hidden">
          <DialogTitle>Bind Base Address</DialogTitle>
        </DialogHeader>
        <div>
          <div className="flex items-center justify-center gap-[6px] text-center text-[20px] leading-[30px] font-extrabold text-[#151515] [-webkit-text-stroke-color:rgba(255,_255,_255,_0.16)] [-webkit-text-stroke-width:0.5px]">
            Bind Base Address
          </div>

          <div className="mt-6 px-2 text-sm leading-[21px] tracking-[0.84px] opacity-60">
            Bind your Base address. If your prediction is correct, 1 $10s will
            be sent to your Base address!
          </div>

          <div className="my-6 flex h-[60px] items-center justify-between gap-3 rounded-[30px] border border-white/20 bg-[#151515] px-5">
            <input
              type="text"
              value={baseAddress}
              onChange={e => setBaseAddress(e.target.value)}
              placeholder="Your Base Address"
              className="flex-1 bg-transparent text-sm leading-[21px] text-white/30 placeholder:text-white/30 focus:outline-none"
            />
            <button
              onClick={handlePaste}
              className="flex-shrink-0 p-[3px] transition-opacity hover:opacity-80"
            >
              <PasteIcon className="size-[18px]" />
            </button>
          </div>

          <div className="my-6 flex items-center justify-between gap-5">
            <div className="flex h-15 items-center justify-center rounded-[30px] border border-white/20 bg-[#151515] px-[5px]">
              <button
                onClick={() => setOpen(false)}
                className="relative h-12 w-[108px] text-sm font-medium transition-transform hover:opacity-80 active:scale-[0.98]"
              >
                <span className="relative z-10">Cancel</span>
                <CancelBtnBg className="absolute inset-0 z-0 h-12 w-full" />
              </button>
            </div>
            <div className="flex h-15 items-center justify-center rounded-[30px] border border-white/20 bg-[#151515] px-[5px]">
              <button
                onClick={handleBind}
                disabled={!baseAddress || isBinding}
                className="relative flex h-12 w-[190px] items-center justify-center text-sm font-medium transition-transform hover:opacity-80 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
              >
                <span className="relative z-10 flex items-center gap-[3px]">
                  <BaseChainIcon className="size-4" /> Bind
                  {isBinding && <Loader2 className="animate-spin" size={16} />}
                </span>
                <BindBtnBg className="absolute inset-0 z-0 h-12 w-full" />
              </button>
            </div>
          </div>

          <div className="text-xs leading-[18px] font-light tracking-[0.72px] opacity-30">
            *You can bind only one address, and it cannot be changed once bound.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default BindDialog;
