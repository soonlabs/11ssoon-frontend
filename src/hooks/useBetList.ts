import { useQuery } from '@tanstack/react-query';

import ENDPOINTS from '@/api';
import { useCurrentAddress } from '@/hooks/useCurrentAddress';

interface BetItem {
  orderId: string;
  betPrice: string;
  direction: 'up' | 'down';
  endPrice: string;
  endTime: string;
  win: boolean;
}

interface BetListResponse {
  data: {
    betList: BetItem[];
  };
}

const fetchBetList = async (address: string) => {
  const limit = 100;
  let page = 1;
  let allBetList: BetItem[] = [];
  let hasMore = true;

  // Fetch all pages in a loop
  while (hasMore) {
    const response = await fetch(ENDPOINTS.betList, {
      method: 'POST',
      body: JSON.stringify({
        address,
        page: {
          page,
          limit,
        },
      }),
    });

    const data: BetListResponse = await response.json();
    const currentPageData = data.data.betList || [];

    // Merge current page data
    allBetList = [...allBetList, ...currentPageData];

    // If current page size is less than limit, it's the last page
    if (currentPageData.length < limit) {
      hasMore = false;
    } else {
      page++;
    }
  }

  return {
    betList: allBetList,
  };
};

export const useBetList = () => {
  const address = useCurrentAddress();
  return useQuery({
    queryKey: ['betList', address],
    queryFn: () => fetchBetList(address!),
    refetchInterval: 5000,
    enabled: !!address,
  });
};
