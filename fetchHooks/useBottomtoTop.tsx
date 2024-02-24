import { useEffect, useRef, useState } from "react";

export const useBottomToTopFetching = (url: string) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef<boolean>(true);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalDataLength, setTotalDataLength] = useState<number>(0);
  const [showGoBottomButton, setShowGoBottomButton] = useState<boolean>(false);
  useEffect(() => {
    const fetchDataLength = async () => {
      const response = await fetch(url);
      const data = await response.json();
      setTotalDataLength(data.length);
    };
    return () => {
      fetchDataLength();
    };
  }, []);
  const fetchData = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 400));
      const response = await fetch(`${url}?_page=${page}&_limit=10`);
      const newData = await response.json();
      setData((prevData) => [...prevData, ...newData]);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      if (containerRef.current) {
        containerRef.current.scrollTop = 100;
      }
    }
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (
      container &&
      container.scrollTop === 0 &&
      !loading &&
      totalDataLength > data.length
    ) {
      fetchData();
    }
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setShowGoBottomButton(scrollTop < scrollHeight - clientHeight - 100);
    }
  };

  const scrollToBottom = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const container = containerRef.current;

    //initialy at the bottom of the page or container
    if (container && data && data.length === 10 && !loading) {
      container.scrollTop = container.scrollHeight;
    }
    //page=1 and firsttime mount then fetch initial data
    if (isMountedRef.current && page === 1) {
      fetchData();
    }

    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
      isMountedRef.current = false;
    };
  }, [loading, page, totalDataLength, data]);

  return {
    totalDataLength,
    containerRef,
    loading,
    data,
    showGoBottomButton,
    scrollToBottom,
  };
};
