"use client";
import { useToptoBottomFetching } from "@/fetchHooks/useToptoBottom";
import { useEffect, useRef, useState } from "react";

export default function TopToBottomFetching() {
  const {
    totalDataLength,
    containerRef,
    loading,
    data,
    showGoTopButton,
    scrollToTop,
  } = useToptoBottomFetching("https://jsonplaceholder.typicode.com/posts");

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

        <div
          className={`fixed bottom-4 right-4 bg-white text-black p-2 rounded cursor-pointer transition-all duration-500 transform ${
            showGoTopButton
              ? "translate-y-0 opacity-100  scale-100"
              : "translate-y-full opacity-0  scale-50"
          }`}
          onClick={() => scrollToTop()}
        >
          Go Top
        </div>
      </div>
    </>
  );
}
