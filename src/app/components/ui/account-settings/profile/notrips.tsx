'use client';

import Image from 'next/image';
import Button from '@/shadcn/ui/Button';

import { useRouter } from 'next/navigation';

type NoPastTripsProps = {
  heading: string;
  image: string;
  desc: string;
  onclick: string;
};

const NoPastTrips = ({ heading, image, desc, onclick }: NoPastTripsProps) => {
  const Router = useRouter();
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-10">
      <h1 className="text-3xl font-semibold mb-6">{heading}</h1>
      <div className="flex flex-col items-center text-center min-h-[60vh] px-4">
        <Image src={image} alt="Past trips" width={250} height={250} />

        <p className="text-gray-600 max-w-md mb-6">{desc}</p>

        <Button
          variant="pink"
          onClick={() => Router.push(onclick)}
          className=" text-white px-6 py-2 rounded-lg font-medium hover:bg-pink-700 transition"
        >
          Book a trip
        </Button>
      </div>
    </div>
  );
};

export default NoPastTrips;
