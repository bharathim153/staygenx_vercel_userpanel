import HomPage from '../components/ui/homepage';
import APICONSTANT from '@/utils/apiconstant';

export default async function Home() {
  const api = process.env.NEXT_PUBLIC_BASE_URL + APICONSTANT.listingsBlocks; // safer
  console.log('API URL:', api);

  const res = await fetch(api, { cache: 'no-store' });
  const data = await res.json();

  console.log('Homepage data fetched:', data.data);

  return (
    <div className="mt-[90px] md:mt-[180px]">
      <HomPage data={data?.data} />
    </div>
  );
}

// import HomPage from "../components/ui/homepage";
// import APICONSTANT from "@/utils/apiconstant";

// export default async function Home() {
//   const api = process.env.NEXT_PUBLIC_BASE_URL + APICONSTANT.listingsBlocks; // safer
//   console.log("API URL:", api);
//   const res = await fetch(api, { cache: "no-store" });
//   const data = await res.json();

//   return (
//     <div className="mt-[90px] md:mt-[180px]">
//       <HomPage data={data?.data}/>
//     </div>
//   );
// }
