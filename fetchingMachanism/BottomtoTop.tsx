
"use client";
import { useBottomToTopFetching } from "@/fetchHooks/useBottomtoTop";
export default function BottomToTopFetching() {
  const {
    totalDataLength,
    containerRef,
    loading,
    data,
    showGoBottomButton,
    scrollToBottom,
  } = useBottomToTopFetching("https://jsonplaceholder.typicode.com/posts");
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
