import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import ENDPOINTS from '@/api';

type Direction = 'up' | 'down';

interface CurrentPriceResponse {
  data: {
    currentPrice: string; // Current price
  };
}

const useCurrentPrice = () => {
  const previousPriceRef = useRef<number | null>(null);
  const [direction, setDirection] = useState<Direction>('up');

  const {
    data: currentPrice,
    isLoading,
    error,
  } = useQuery<number>({
    queryKey: ['currentPrice'],
    queryFn: () =>
      fetch(ENDPOINTS.currentPrice, {
        method: 'POST',
        body: JSON.stringify({ symbol: 'SOL-USDT' }),
      })
        .then(res => res.json())
        .then((data: CurrentPriceResponse) =>
          parseFloat(data.data?.currentPrice)
        ),
    refetchInterval: 1000, // Poll every 1 second
    refetchIntervalInBackground: true, // Continue polling in the background
  });

  useEffect(() => {
    if (currentPrice !== undefined && previousPriceRef.current !== null) {
      if (currentPrice > previousPriceRef.current) {
        setDirection('up');
      } else if (currentPrice < previousPriceRef.current) {
        setDirection('down');
      }
      // If price doesn't change, keep previous direction
    }

    if (currentPrice !== undefined) {
      previousPriceRef.current = currentPrice;
    }
  }, [currentPrice]);

  return { price: currentPrice, direction, isLoading, error };
};

export default useCurrentPrice;
