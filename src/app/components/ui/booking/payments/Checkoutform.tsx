'use client';

import { useCustomMutation } from '@/hooks/useCustomeMutation';
import Button from '@/shadcn/ui/Button';
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import { usePaymentStore } from '../store/payments';
import ThreeDotLoader from '@/app/components/threedotLoader';

interface CheckoutFormProps {
  data: { id?: string; client_secret?: string };
}

const CheckoutForm = ({ data }: CheckoutFormProps) => {
  const router = useRouter();
  const { Reservatoin } = usePaymentStore();
  const { trigger: statusTrigger, isPending } = useCustomMutation(Reservatoin, {
    onSuccessCallback: () => {
      router.push('/book');
    },
  });
  const bookingData = data;
  const stripe = useStripe();
  const elements = useElements();
  const searchParams =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : null;
  const listingId = searchParams?.get('id') ?? '';
  const StartDateStr = searchParams?.get('startDate') ?? '';
  const EndDateStr = searchParams?.get('endDate') ?? '';
  const StartDate = StartDateStr ? new Date(StartDateStr) : null;
  const EndDate = EndDateStr ? new Date(EndDateStr) : null;
  const adult = searchParams?.get('adults') ?? '1';
  const children = searchParams?.get('children') ?? '0';
  // const infant = searchParams?.get('infants') ?? "0";
  // const pet = searchParams?.get('pets') ?? "0";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    debugger;
    const currentURL = new URL(window.location.href);
    const domainURL = currentURL.host;
    const returnPath = '/bookingsuccess';
    const returnURL = `http://${domainURL}${returnPath}`;

    try {
      console.log('Starting payment confirmation...');

      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnURL,
        },
        redirect: 'if_required', // <== Important!
      });

      console.log('Stripe payment confirmation result:', result);

      if (result.error) {
        alert(result.error.message);
      } else if (
        result.paymentIntent &&
        result.paymentIntent.status === 'succeeded'
      ) {
        try {
          debugger;
          const id1 = bookingData?.id;
          const data = {
            listingId,
            checkInDate: StartDate,
            checkOutDate: EndDate,
            guestCount: parseInt(adult) + parseInt(children),
            paymentIntentId: id1,
          };
          const response = statusTrigger({ body: data });
          console.log('Status trigger response:', response);
          if (response.status === 200) {
            router.push('/rooms/booking/bookingSuccess?paymentMode=card');
          } else {
            console.error('Unexpected status code:', response.status);
          }

        } catch (error) {
          console.error('GET API error:', error);
        }
      } else {
        console.log(
          `Payment not completed. Status: ${result.paymentIntent?.status || 'unknown'}`
        );
      }
    } catch (error) {
      console.error('Unhandled Stripe error:', error);
    }
  };

  //   const handleSubmit = async (event: any) => {
  //     event.preventDefault();

  //     if (!stripe || !elements) {
  //       return;
  //     }

  //     const currentURL = new URL(window.location.href);
  //     const domainURL = currentURL.host;
  //     const returnPath = '/bookingsuccess';
  //     const returnURL = `http://${domainURL}${returnPath}`;
  //     debugger
  //     const result = await stripe
  //       .confirmPayment({
  //         elements,
  //         confirmParams: {
  //           return_url: returnURL,
  //         },
  //       })
  //     console.log('Stripe payment confirmation result:', result);

  //   .then(
  //       async (response: {
  //         error?: StripeError;
  //         paymentIntent?: { status: string; id: string };
  //       }) => {
  //         if (response.error) {
  //           alert(response.error.message);
  //         } else if (response.paymentIntent && response.paymentIntent.status === 'succeeded') {
  //           try {
  //             debugger
  //             const id1 = bookingData.payment.id;
  //             const data = { id: id1, invoiceId: bookingData.invoiceId };
  //             const response = statusTrigger({ body: data });
  //             console.error('Unexpected status code:', response);
  //             // if (response.status === 200) {
  //             //   router.push('/rooms/booking/bookingSuccess?paymentMode=card')
  //             // } else {
  //             //   console.error('Unexpected status code:', response.status)
  //             // }
  //           } catch (error) {
  //             console.error('GET API error:', error);
  //           }
  //         } else {
  //           console.log(
  //             `Payment not completed. Status: ${response.paymentIntent?.status || 'unknown'}`
  //           );
  //         }
  //       }
  //     )
  //   .catch((error) => {
  //     console.log(error);
  //   });

  // console.log('result', result);
  //   };

  return (
    <div className="">
      <form onSubmit={handleSubmit}>
        <div className=" p-[25px] md:p-[10px] flex items-center justify-center">
          <div className=" w-full md:w-[50%]">
            <PaymentElement />
            <div className="flex items-center justify-center mt-8">
              <Button
                type="submit"
                variant="pink"
                disabled={!stripe || isPending}
              >
                {isPending ? <ThreeDotLoader variant="white" /> : 'Submit'}
              </Button>
            </div>
          </div>
        </div>
      </form>
      {/* <Footer/> */}
    </div>
  );
};
export default CheckoutForm;
