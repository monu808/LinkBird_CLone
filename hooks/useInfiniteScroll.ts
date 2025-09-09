import { useEffect, useState, useRef, RefObject } from 'react';

interface UseInfiniteScrollProps {
  loadMore: () => void;
  hasMore: boolean;
  loading: boolean;
}

export function useInfiniteScroll<T extends HTMLElement>(
  { loadMore, hasMore, loading }: UseInfiniteScrollProps
): [RefObject<T>] {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<T>(null);

  useEffect(() => {
    // If loading or no more items, disconnect the observer
    if (loading || !hasMore) {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      return;
    }

    // Create a new intersection observer
    observerRef.current = new IntersectionObserver(entries => {
      // If the element is visible and we have more items to load
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadMore();
      }
    }, {
      threshold: 0.1, // Trigger when at least 10% of the target is visible
      rootMargin: '100px', // Start loading before the user reaches the end
    });

    // Observe the element
    if (elementRef.current) {
      observerRef.current.observe(elementRef.current);
    }

    // Clean up on unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMore, hasMore, loading]);

  return [elementRef];
}
