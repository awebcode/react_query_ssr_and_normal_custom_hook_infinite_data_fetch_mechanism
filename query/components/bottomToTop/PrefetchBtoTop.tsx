import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { fetchData } from "@/query/actions/fetchAction";
import BtoTopQuery from "./BottomtoTopQuery";

export default async function BottomToTopQueryMain() {
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["posts"],
    queryFn: fetchData,
    initialPageParam: 1,
  });

  return (
    // Neat! Serialization is now as easy as passing props.
    // HydrationBoundary is a Client Component, so hydration will happen there.
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BtoTopQuery />
    </HydrationBoundary>
  );
}
