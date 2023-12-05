// src/index.ts
import debounce from "lodash.debounce";
import { useLayoutEffect, useRef } from "react";
function useInfiniteScroll(props = {}) {
  const { hasMore, distance = 250, isEnabled = true, shouldUseLoader = true, onLoadMore } = props;
  const scrollContainerRef = useRef(null);
  const loaderRef = useRef(null);
  const previousY = useRef();
  const previousRatio = useRef(0);
  useLayoutEffect(() => {
    const scrollContainerNode = scrollContainerRef.current;
    if (!isEnabled || !scrollContainerNode || !hasMore)
      return;
    if (shouldUseLoader) {
      const loaderNode = loaderRef.current;
      if (!loaderNode)
        return;
      const options = {
        root: scrollContainerNode,
        rootMargin: `0px 0px ${distance}px 0px`
      };
      const listener = (entries) => {
        entries.forEach(({ isIntersecting, intersectionRatio, boundingClientRect = {} }) => {
          const y = boundingClientRect.y || 0;
          if (isIntersecting && intersectionRatio >= previousRatio.current && (!previousY.current || y < previousY.current)) {
            onLoadMore == null ? void 0 : onLoadMore();
          }
          previousY.current = y;
          previousRatio.current = intersectionRatio;
        });
      };
      const observer = new IntersectionObserver(listener, options);
      observer.observe(loaderNode);
      return () => observer.disconnect();
    } else {
      const debouncedOnLoadMore = onLoadMore ? debounce(onLoadMore, 200) : void 0;
      const checkIfNearBottom = () => {
        if (scrollContainerNode.scrollHeight - scrollContainerNode.scrollTop <= scrollContainerNode.clientHeight + distance) {
          debouncedOnLoadMore == null ? void 0 : debouncedOnLoadMore();
        }
      };
      scrollContainerNode.addEventListener("scroll", checkIfNearBottom);
      return () => {
        scrollContainerNode.removeEventListener("scroll", checkIfNearBottom);
      };
    }
  }, [hasMore, distance, isEnabled, onLoadMore, shouldUseLoader]);
  return [loaderRef, scrollContainerRef];
}
export {
  useInfiniteScroll
};
