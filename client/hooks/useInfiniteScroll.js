import { useCallback, useEffect, useRef, useState } from "react";

const useIntersection = (ref) => {
  const observerRef = useRef(null);
  const [intersectionObserverEntry, setIntersectionObserverEntry] =
    useState(null);

  const handler = (entries) => {
    setIntersectionObserverEntry(entries[0]);
  };

  const getObserver = useCallback(() => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(handler);
    }
    return observerRef.current;
  });

  useEffect(() => {
    if (ref.current && typeof IntersectionObserver === "function") {
      getObserver().observe(ref.current);
    }
    return () => {
      setIntersectionObserverEntry(null);
      getObserver().disconnect();
    };
  }, [ref.current]);

  return intersectionObserverEntry;
};

export default useIntersection;
