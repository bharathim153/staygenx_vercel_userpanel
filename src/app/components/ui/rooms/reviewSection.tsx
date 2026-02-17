import Button from '@/shadcn/ui/Button';

// const reviews = [
//   {
//     name: 'Ravi',
//     joined: '5 years on Staygenx',
//     timeAgo: '2 weeks ago',
//     rating: 5,
//     text: "Visited Smith's garden with family and stayed for 2 days. The place is great, nice ambience, very peaceful, the front of the guest house has lot of mango trees with fully covered canop...",
//     avatar: '',
//   },
//   {
//     name: 'Arun',
//     joined: '4 months on Staygenx',
//     timeAgo: '3 weeks ago',
//     rating: 5,
//     text: 'One of the best stays we’ve had on Staygenx so far! The host, Smitha, was incredible and she truly knows how to treat her guests. The aunty who works there was also very friendly an...',
//     avatar: '',
//   },
//   {
//     name: 'Vivek Balaji',
//     joined: '4 months on Staygenx',
//     timeAgo: '3 weeks ago',
//     rating: 5,
//     text: 'We had an amazing stay at Smitha Garden. This property is spotless, calm, and peaceful. The check-in and check-out process was also very smooth....',
//     avatar: '', // fallback to initials
//   },
//   {
//     name: 'Harsh',
//     joined: '9 years on Staygenx',
//     timeAgo: '3 weeks ago',
//     rating: 5,
//     text: 'Absolutely lovely. So far, the best stay in Staygenx. Place is farm stay surrounded by lush green and mango trees. Our pet Rio was absolutely have the best of his time for he had a huge ...',
//     avatar: '',
//   },
// ];

export default function ReviewList({
  roomData,
}: {
  roomData: Record<string, unknown>;
}) {
  const reviewsCount =
    typeof roomData.reviewsCount === 'number' ? roomData.reviewsCount : 0;
  return (
    <div className=" border-b py-6">
      {reviewsCount > 0 ? (
        <div className="flex md:grid md:grid-cols-2 gap-6 overflow-x-auto snap-x scroll-px-4 px-4 pb-4 md:overflow-visible">
          {/* {reviews.map((review, idx) => (
              <div
                key={idx}
                className="min-w-[320px]  snap-start flex-shrink-0 md:flex-shrink p-4  rounded-lg "
              >
                <div className="flex flex-col-reverse md:flex-col items-start gap-3">
              
                  <div className="flex gap-3">
                    {review.avatar ? (
                      <Image
                        src={review.avatar}
                        alt={review.name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full font-semibold text-white">
                        {review.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">{review.name}</p>
                      <p className="text-xs text-gray-500">{review.joined}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm mt-2">
                      {'★'.repeat(review.rating)}{' '}
                      <span className="text-gray-500 font-medium">
                        · {review.timeAgo}
                      </span>
                    </p>
                    <p className="text-sm text-gray-800 mt-1 line-clamp-3 max-w-[400px]">
                      {review.text}
                    </p>
                    <Button className="mt-1 text-sm text-black font-semibold underline">
                      Show more
                    </Button>
                  </div>
                </div>
              </div>
            ))} */}
        </div>
      ) : (
        <></>
      )}

      {/* Bottom Action */}
      {reviewsCount > 6 ? (
        <div className="mt-6 px-4 flex flex-col md:flex-row items-center gap-4">
          <Button
            variant="gray"
            className="px-5 py-2  rounded-lg text-sm font-medium  transition w-full md:w-auto"
          >
            Show all {reviewsCount} reviews
          </Button>
          <a
            href="#"
            className="text-sm text-gray-600 underline hover:text-gray-800"
          >
            Learn how reviews work
          </a>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
