"use client";
import { fetchData } from "@/query/actions/fetchAction";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const BottomtoTopQuery = () => {
  const { data, isLoading, fetchNextPage, hasNextPage,isFetching } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: fetchData,
    getNextPageParam: (lastPage, allPages) => {
      const totalItems = lastPage.total;

      // Assuming lastPage.pageParam is the current page number
      const currentPage = lastPage.pageParam;

      // Assuming you are fetching 10 items per page
      const itemsPerPage = 10;

      // Calculate the total number of items fetched so far
      const totalFetchedItems = currentPage * itemsPerPage;

      // Stop fetching when total fetched items exceed or equal the total items
      return totalFetchedItems < totalItems ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const posts = data?.pages.flatMap((p) => p.posts) || [];
  return (
    <div>
       <h1 className="text-center text-5xl p-6">RQ/BOTTOM TO TOP FETCHING</h1>
      {isLoading && <h1 className="text-center text-2xl p-6">Loading fetchData....</h1>}
      {isFetching && <h1 className="text-center text-2xl p-4">Fetching fetchData....</h1>}
      <div
        id="scrollableDivReverse"
        style={{
          height: "80vh",
          display: "flex",
          flexDirection: "column-reverse",
          overflow: "auto",
        }}
      >
        <InfiniteScroll
          dataLength={posts.length}
          next={() => {
            fetchNextPage();
          }}
          hasMore={hasNextPage}
          style={{ display: "flex", flexDirection: "column-reverse", height: "100%" }}
          endMessage={
            <h1 className="text-green-600 text-2xl p-4 text-center">YOu are all set!</h1>
          }
          inverse={true}
          loader={<h4>Loading...</h4>}
          scrollableTarget="scrollableDivReverse"
          scrollThreshold={1}
        >
          {/* Render your posts here */}

          {/* Dont allow div.flex here at this line */}
          {posts.map((post) => (
            <div key={post.id} className="p-4 border border-gray-400">
              {/* Render your post content */}
              <h1 className="text-xl">{post.id}</h1>
              <h1 className="text-2xl">{post.title}</h1>
              <p>{post.body}</p>
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default BottomtoTopQuery;
