import {
  useAppKit,
  useAppKitAccount,
  useDisconnect,
} from '@reown/appkit/react';
import { useState } from 'react';

import DisconnectDialogTitleIcon from '@/assets/disconnect-dialog-title-icon.svg?react';
import DisconnectBtnBg from '@/assets/disconnect-btn-bg.svg?react';
import ConnectedBtnBg from '@/assets/connected-btn-bg.svg?react';
import ConnectBtnBg from '@/assets/connect-btn-bg.svg?react';
import SolanaChainIcon from '@/assets/chain-solana-icon.svg?react';
import Logo from '@/assets/logo.svg?react';
import { formatAddress, fixNumber } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import config from '@/config';
import { useSplTokenBalance } from '@/hooks/useSplTokenBalance';

function Header() {
  const [openDisconnectDialog, setOpenDisconnectDialog] = useState(false);
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();
  const { address: solanaAddress } = useAppKitAccount({ namespace: 'solana' });
  const isSolanaConnected = !!solanaAddress;

  const handleConnectBtnClick = () => {
    if (isSolanaConnected) {
      setOpenDisconnectDialog(true);
    } else {
      open({
        view: 'Connect',
        namespace: 'solana',
      });
    }
  };

  const solanaUsdcBalance = useSplTokenBalance(config.SOLANA_USDC_ADDRESS);
  const solana11sSoonBalance = useSplTokenBalance(
    config.SOLANA_11S_SOON_ADDRESS
  );

  return (
    <>
      <div className="relative z-10 flex items-center justify-between gap-6">
        <Logo className="h-15 w-15" />
        <div className="flex h-15 flex-1 items-center justify-between rounded-[12px] bg-[#151515] p-1.5 pl-5">
          <div className="font-doto text-[20px] leading-[18px] opacity-60">
            <div className="mb-0.5">
              USDC: {fixNumber(solanaUsdcBalance?.uiAmount, 2)}
            </div>
            <div className="flex items-center gap-1">
              $11s : {fixNumber(solana11sSoonBalance?.uiAmount, 2)}
            </div>
          </div>

          <div className="flex items-center gap-[3px]">
            <button
              className="relative flex h-12 w-[160px] items-center justify-center transition-transform hover:opacity-80 active:scale-[0.98]"
              onClick={handleConnectBtnClick}
            >
              <span className="relative z-10 flex items-center gap-[5px] text-sm font-medium">
                <SolanaChainIcon className="size-5" />
                {solanaAddress
                  ? formatAddress(solanaAddress)
                  : 'Connect Wallet'}
              </span>
              {solanaAddress ? (
                <ConnectedBtnBg className="absolute top-0 right-0 bottom-0 left-0 z-0 h-12 w-full" />
              ) : (
                <ConnectBtnBg className="absolute top-0 right-0 bottom-0 left-0 z-0 h-12 w-full" />
              )}
            </button>
          </div>
        </div>
      </div>
      <Dialog
        open={openDisconnectDialog}
        onOpenChange={setOpenDisconnectDialog}
      >
        <DialogContent
          hideCloseButton
          className="w-[350px] rounded-[60px] border-white/10 bg-gradient-to-b from-[#292929] to-[#1C1C1C] shadow-[0_0_60px_0_rgba(0,0,0,0.80)]"
        >
          <DialogHeader className="hidden">
            <DialogTitle>Address for Receiving</DialogTitle>
          </DialogHeader>
          <div>
            <div className="flex items-center justify-center gap-[6px] text-center text-[20px] leading-[30px] font-extrabold text-[#151515] [-webkit-text-stroke-color:rgba(255,_255,_255,_0.16)] [-webkit-text-stroke-width:0.5px]">
              <DisconnectDialogTitleIcon />
              Address for Receiving
            </div>

            <div className="my-6 text-center text-[18px] leading-[27px] font-medium opacity-60">
              {formatAddress(solanaAddress)}
            </div>

            <div className="flex h-15 items-center justify-center rounded-[30px] border border-white/20 bg-[#151515]">
              <button
                onClick={() => {
                  disconnect({
                    namespace: 'solana',
                  });
                  setOpenDisconnectDialog(false);
                }}
                className="relative h-12 w-[290px] text-sm font-medium transition-transform hover:opacity-80 active:scale-[0.98]"
              >
                <span className="relative z-10">Disconnect</span>
                <DisconnectBtnBg className="absolute inset-0 z-0 h-12 w-full" />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Header;
