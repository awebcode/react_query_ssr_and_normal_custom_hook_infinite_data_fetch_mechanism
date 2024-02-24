"use client";
import { fetchData } from "@/query/actions/fetchAction";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const ToptoBottomQuery = () => {
  const { data, isLoading,isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery({
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
      <h1 className="text-center text-5xl p-6">RQ/TOP TO BOTTOM FETCHING</h1>
      <div
        id="scrollableDiv"
        className="h-[70vh] overflow-auto"
        // style={{
        //   height: 900,
        //   overflow: "auto",
        //   display: "flex",
        //   flexDirection: "column-reverse",
        // }}
      >
        <InfiniteScroll
          dataLength={posts.length}
          next={() => {
            console.log("called");
            fetchNextPage();
          }}
          //   style={{ display: "flex", flexDirection: "column-reverse" }}
          //   inverse={true}
          endMessage={
            <h1 className="text-green-600 text-2xl p-4 text-center">YOu are all set!</h1>
          }
          hasMore={hasNextPage}
          loader={<h4>Loading...</h4>}
          scrollableTarget="scrollableDiv"
        >
          {/* Render your posts here */}
          <div className="flex flex-wrap flex-col gap-5">
            {posts.map((post) => (
              <div key={post.id} className="p-4 border border-gray-400">
                {/* Render your post content */}
                <h1 className="text-xl">{post.id}</h1>
                <h1 className="text-2xl">{post.title}</h1>
                <p>{post.body}</p>
              </div>
            ))}
            {isLoading && (
              <h1 className="text-center text-2xl p-4">Loading fetchData....</h1>
            )}
            {isFetching && (
              <h1 className="text-center text-2xl p-4">Fetching fetchData....</h1>
            )}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default ToptoBottomQuery;
