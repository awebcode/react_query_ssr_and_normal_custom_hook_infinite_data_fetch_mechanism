import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import TtoBottomQu from "./ToptoBottomQu";
import { fetchData } from "@/query/actions/fetchAction";


export default async function TopToBottomQueryMain() {
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey:["posts"],
    queryFn:fetchData,
    initialPageParam: 1,
  });
  
  return (
    // Neat! Serialization is now as easy as passing props.
    // HydrationBoundary is a Client Component, so hydration will happen there.
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TtoBottomQu/>
    </HydrationBoundary>
  );
}
