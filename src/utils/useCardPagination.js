import { useState } from 'react';

export const DEFAULT_VISIBLE_COUNT = 52;

export function useCardPagination(initialCount = DEFAULT_VISIBLE_COUNT) {
  const [visibleCardCount, setVisibleCardCount] = useState(initialCount);

  const handleShowMore = () => {
    setVisibleCardCount(prev => prev + DEFAULT_VISIBLE_COUNT);
  };

  return { visibleCardCount, handleShowMore };
}