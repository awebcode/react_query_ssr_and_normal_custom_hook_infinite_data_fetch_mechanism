import { useEffect, useRef, useState } from "react";

export const useToptoBottomFetching = (url: string) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef<boolean>(true);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalDataLength, setTotalDataLength] = useState<number>(0);
  const [showGoTopButton, setShowGoTopButton] = useState<boolean>(false);
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
    }
  };

  const handleScroll = () => {
    const container = containerRef.current;
    // container.scrollHeight - container.scrollTop === container.clientHeight //when touch current bottom

    // container.scrollHeight - container.scrollTop <= container.clientHeight + 50 //when bottom to 50px up then it work if you set 100 then show same key erros
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (
        scrollHeight - scrollTop <= clientHeight + 50 &&
        !loading &&
        totalDataLength > data.length
      ) {
        fetchData();
      }
        setShowGoTopButton(scrollTop > 200);
      
    }
  };

  useEffect(() => {
    const container = containerRef.current;

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
  }, [loading, page, totalDataLength]);

  const scrollToTop = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };
  return {
    totalDataLength,
    containerRef,
    loading,
    data,
    showGoTopButton,
    scrollToTop,
  };
};
