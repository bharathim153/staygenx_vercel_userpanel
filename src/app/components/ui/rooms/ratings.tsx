import {
  SprayCan,
  CheckCheck,
  KeyRound,
  MessageCircle,
  Map,
  Tag,
} from 'lucide-react';

const ratingDetails = [
  { label: 'Cleanliness', rating: 5.0, icon: <SprayCan size={20} /> },
  { label: 'Accuracy', rating: 4.9, icon: <CheckCheck size={20} /> },
  { label: 'Check-in', rating: 5.0, icon: <KeyRound size={20} /> },
  { label: 'Communication', rating: 5.0, icon: <MessageCircle size={20} /> },
  { label: 'Location', rating: 4.7, icon: <Map size={20} /> },
  { label: 'Value', rating: 4.9, icon: <Tag size={20} /> },
];

export default function GuestRatingSummary({
  roomData,
}: {
  roomData: Record<string, unknown>;
}) {
  return (
    <>
      {roomData.reviewsCount === 0 ? (
        <div className="p-6 text-center  border-t">
          {/* Top Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center gap-2 text-5xl font-bold">
              <span>5.0</span>
            </div>
            <h2 className="text-lg font-semibold mt-2">Guest favourite</h2>
            <p className="text-sm text-gray-600 max-w-md">
              This home is in the <span className="font-semibold">top 10%</span>{' '}
              of eligible listings based on ratings, reviews and reliability
            </p>
          </div>

          {/* Rating Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-7 gap-6 mt-8 text-left items-center justify-center  pt-6">
            {/* Overall rating chart */}
            <div className="hidden md:block col-span-1">
              <h4 className="font-medium text-sm mb-2">Overall rating</h4>
              {[5, 4, 3, 2, 1].map(level => (
                <div
                  key={level}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <span className="w-5">{level}</span>
                  <div className="flex-1 h-1 rounded-full bg-gray-200">
                    {level === 5 && (
                      <div className="h-1 bg-black rounded-full w-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Ratings per category */}
            {ratingDetails.map((item, index) => (
              <div
                key={item.label}
                className={`hidden md:flex flex-col items-start gap-1 text-sm ${index !== ratingDetails.length - 1 ? 'border-r' : ''} `}
              >
                <span className="font-medium">{item.label}</span>
                <span className="text-lg font-semibold">{item.rating}</span>
                <span className="text-gray-600">{item.icon}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center">No Review</p>
      )}
    </>
  );
}
