// components/ThingsToKnow.tsx

export default function ThingsToKnow() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Things to know</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-800">
        {/* House Rules */}
        <div>
          <h3 className="font-semibold mb-2">House rules</h3>
          <p>Check-in after 12:00 pm</p>
          <p>Checkout before 11:00 am</p>
          <p>4 guests maximum</p>
          <a
            href="#"
            className="text-black underline font-medium inline-flex items-center mt-2"
          >
            Show more <span className="ml-1">›</span>
          </a>
        </div>

        {/* Safety & Property */}
        <div>
          <h3 className="font-semibold mb-2">Safety & property</h3>
          <p>Carbon monoxide alarm not reported</p>
          <p>Smoke alarm not reported</p>
          <p>Exterior security cameras on property</p>
          <a
            href="#"
            className="text-black underline font-medium inline-flex items-center mt-2"
          >
            Show more <span className="ml-1">›</span>
          </a>
        </div>

        {/* Cancellation Policy */}
        <div>
          <h3 className="font-semibold mb-2">Cancellation policy</h3>
          <p>
            Cancel before check-in on 20 Jun for a partial refund. After that,
            the reservation is non-refundable.
          </p>
          <p className="mt-1">Review this Host’s full policy for details.</p>
          <a
            href="#"
            className="text-black underline font-medium inline-flex items-center mt-2"
          >
            Show more <span className="ml-1">›</span>
          </a>
        </div>
      </div>
    </div>
  );
}
