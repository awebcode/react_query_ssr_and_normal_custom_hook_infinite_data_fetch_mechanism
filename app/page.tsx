import BottomToTopQueryMain from "@/query/components/bottomToTop/PrefetchBtoTop";
import TopToBottomQueryMain from "@/query/components/topToBottom/PrefetchQueryServer";

export default function Home() {
  return (
    <>
      {/* Nor mal func data fetching logic with infinite t/b or bottom to top fetching */}
      {/* <BottomToTopFetching />
      <div className="py-20"></div>
      <TopToBottomFetching/> */}
      {/* react query | infinite scroll component| infinite ssr data fetching mechanism */}
      <BottomToTopQueryMain />
      <TopToBottomQueryMain />
    </>
  );
}
