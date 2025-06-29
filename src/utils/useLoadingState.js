import { useState } from 'react';

export function useLoadingState(initial = false) {
  const [isLoading, setIsLoading] = useState(initial);
  return { isLoading, setIsLoading };
}