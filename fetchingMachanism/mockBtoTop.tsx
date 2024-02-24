"use client";
import { useEffect, useRef, useState } from "react";

export default function BottomToTopFetching() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef<boolean>(true); // Use a ref to track if the component is mounted
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalDataLength, setTotalDataLength] = useState<number>(0);
  const [showGoBottomButton, setShowGoBottomButton] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts`);
      const data = await response.json();
      setTotalDataLength(data.length);
    };
    return () => {
      fetchData();
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const fetchData = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 400));
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`
        );
        const newData = await response.json();
        setData((prevData) => [...prevData, ...newData]);
        setPage((prevPage) => prevPage + 1);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
        if (container) {
          //after loading then scroll down 100px
          container.scrollTop = 100;
        }
      }
    };

    // Check if the component is mounted before making the initial fetch
    if (isMountedRef.current && page === 1) {
      fetchData(); // Initial data fetch
    }
    const handleScroll = () => {
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

    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    if (container && data && data.length === 10 && !loading) {
      container.scrollTop = container.scrollHeight;
    };
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
      isMountedRef.current = false;
    };
  }, [loading, page, totalDataLength, data]);

  //scroll to bottom
  const scrollToBottom = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  };
  return (
    <>
      <h1 className="text-center text-4xl font-bold p-2">Bottom to top data fetching</h1>
      <div ref={containerRef} className="h-[80vh] overflow-y-scroll p-4 ">
        {loading && (
          <div className="text-center text-2xl text-gray-500 pt-10">Loading...</div>
        )}
        {totalDataLength > 0 && totalDataLength === data.length && (
          <div className="text-center text-2xl text-green-400 pt-10">
            You have viwed all data
          </div>
        )}
        <div className="p-4 m-4">
          {data
            .sort((a, b) => b.id - a.id) // Sort data based on ID in descending order
            .map((item) => (
              <div key={item.id} className=" p-4 border-b border-gray-300">
                <h1 className="text-2xl m-2">{item.id}</h1>
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <p>{item.body}</p>
              </div>
            ))}
        </div>

        <div
          className={`absolute bottom-4 right-4 bg-white text-black p-2 rounded cursor-pointer transition-all duration-500 transform ${
            showGoBottomButton
              ? "translate-y-0 opacity-100  scale-100"
              : "translate-y-full opacity-0  scale-50"
          }`}
          onClick={() => scrollToBottom()}
        >
          Go Bottom
        </div>
      </div>
    </>
  );
}
