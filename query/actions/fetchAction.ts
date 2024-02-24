export const fetchData = async ({ pageParam = "" }: any) => {
  console.log({pageParam})
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=10`
  );
  const data =await response.json();
  return {posts:data,pageParam,total:100}
};
