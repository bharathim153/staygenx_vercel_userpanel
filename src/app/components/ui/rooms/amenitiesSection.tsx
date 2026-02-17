import Button from '@/shadcn/ui/Button';

interface AmenitiesSectionProps {
  roomData: Record<string, unknown>;
}

// const defaultAmenities = [
//   { icon: <CookingPot size={20} />, label: 'Kitchen' },
//   { icon: <Briefcase size={20} />, label: 'Dedicated workspace' },
//   { icon: <PawPrint size={20} />, label: 'Pets allowed' },
//   { icon: <WashingMachine size={20} />, label: 'Washing machine' },
//   {
//     icon: <AlarmClock size={20} />,
//     label: 'Carbon monoxide alarm',
//     available: false,
//   },
//   { icon: <Wifi size={20} />, label: 'Wifi' },
//   { icon: <ParkingSquare size={20} />, label: 'Free parking on premises' },
//   { icon: <Tv size={20} />, label: 'TV' },
//   {
//     icon: <Camera size={20} />,
//     label: 'Exterior security cameras on property',
//   },
//   { icon: <AlarmSmoke size={20} />, label: 'Smoke alarm', available: false },
// ];

export default function AmenitiesSection({ roomData }: AmenitiesSectionProps) {
  // You can use roomData to customize amenities if needed
  const amenities = Array.isArray(roomData.amenities) ? roomData.amenities : [];
  return (
    <div className="py-6 border-b px-5">
      <h2 className="text-[15px] font-semibold mb-4">What this place offers</h2>

      {amenities.length === 0 ? (
        <div className="text-gray-500 text-sm mb-4">
          No amenities available.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {amenities.map((item, index) => (
            <div key={index} className="flex items-center gap-3 text-sm">
              <div className="text-gray-700">{item.icon}</div>
              <span
                className={`${
                  item.available === false
                    ? 'line-through text-gray-400 text-[15px]'
                    : 'text-gray-800 text-[15px]'
                }`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {amenities.length > 6 && (
        <Button
          variant="gray"
          className="mt-6 px-4 py-2 text-sm rounded-md  transition"
        >
          Show all {amenities.length} amenities
        </Button>
      )}
      {/* 
      <Button
        variant="gray"
        className="mt-6 px-4 py-2 text-sm rounded-md  transition"
      >
        Show all {amenities.length} amenities
      </Button> */}
    </div>
  );
}
