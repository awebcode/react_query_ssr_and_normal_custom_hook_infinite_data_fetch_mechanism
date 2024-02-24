"use client";
import { useEffect, useRef, useState } from "react";

export default function TopToBottomFetching() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef<boolean>(true);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalDataLength, setTotalDataLength] = useState<number>(0);

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
        await new Promise((resolve) => setTimeout(resolve, 800));

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
      }
    };

    const handleScroll = () => {
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
      }
    };

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

  return (
    <>
      <h1 className="text-center text-4xl font-bold p-2">Top to bottom data tetching</h1>
      <div ref={containerRef} className="h-[80vh] overflow-y-scroll p-4">
        {data
          //   .sort((a, b) => a.id - b.id)
          .map((item) => (
            <div key={item.id} className="p-4 border-b border-gray-300">
              <h1 className="text-2xl m-2">{item.id}</h1>
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p>{item.body}</p>
            </div>
          ))}
        {loading && (
          <div className="text-center text-2xl text-gray-500 pt-10">Loading...</div>
        )}

        {totalDataLength > 0 && totalDataLength === data.length && (
          <div className="text-center text-2xl text-green-400 pt-10">
            You have viewed all data
          </div>
        )}
      </div>
    </>
  );
}
