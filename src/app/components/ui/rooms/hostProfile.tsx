import {  ShieldCheck } from 'lucide-react';
import Button from '@/shadcn/ui/Button';
import ImageComponent from '../../image/imageComponent';

export interface UserInfo {
  _id: string;
  profileImage: string; // relative path from backend
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  phoneCode: string;
  userinfo: UserInfo;
}
interface HostSectionProps {
  host: User;
}

export default function HostProfile({ host }: HostSectionProps) {
  console.log('HostinHostProfile:', host?.userinfo);
  return (
    <div className="p-6 md:flex md:justify-between gap-10 border-b">
      {/* Left: Host Card */}
      <div className="max-w-[425px]">
        <h2 className="text-xl mb-4">Meet your host</h2>

        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between  p-6 rounded-xl shadow-lg border ">
            {/* Profile Image */}
            <div className="flex flex-col items-center sm:min-w-[204px]">
              <ImageComponent
                src={host?.userinfo?.profileImage || ''}
                alt="openx"
                width={80}
                height={80}
                className="rounded-full object-cover w-[80px] h-[80px]"
              />
              <h3 className="text-1xl font-semibold mt-5">
                {host?.firstName} {host?.lastName}
              </h3>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-2">
                <ShieldCheck size={14} className="text-pink-500" />
                Superhost
              </p>
            </div>

            {/* Info */}
            <div>
              <div className="flex flex-col gap-1 sm:min-w-[120px]">
                <div>
                  <p className="text-[18px] font-bold">223</p>
                  <p className="text-[12px] text-[#6a6a6a]">Reviews</p>
                </div>
                <hr />
                <div>
                  <p className="text-[18px] font-bold">4.94 ★</p>
                  <p className="text-[12px] text-[#6a6a6a]"> Rating</p>
                </div>
                <hr />
                <div>
                  <p className="text-[18px] font-bold">3</p>
                  <p className="text-[12px] text-[#6a6a6a]">Years hosting</p>
                </div>
              </div>
            </div>
          </div>

          {/* Extra Info */}
          {/* <div className="text-sm text-gray-800 space-y-4">
            <div className="flex items-start gap-2">
              <GraduationCap size={16} className="mt-1" />
              <span>Where I went to school: kerala, TRIVANDRUM</span>
            </div>
            <div className="flex items-start gap-2">
              <Briefcase size={16} className="mt-1" />
              <span>My work: Nursing Officer</span>
            </div>
            <p className="">
              It&apos;s a new farm house. Feel the real beauty <br /> of nature
              (Website hidden by StaygenX) — a Kerala style house with a good
              garden.
            </p>
          </div> */}
        </div>
      </div>

      {/* Right: Host Details */}
      <div className="flex-1 mt-10 md:mt-0">
        <h3 className="text-lg mb-2">
          {host?.firstName} is a Superhost
        </h3>
        <p className="text-[16px] text-gray-700 mb-4">
          Superhosts are experienced, highly rated hosts who are committed to
          providing great stays for guests.
        </p>

        <h4 className="text-lg mb-1 mt-5">Host details</h4>
        <p className="text-[16px] text-gray-800 mb-1 mt-4">Response rate: 100%</p>
        <p className="text-[16px] text-gray-800 mb-6">Responds within an hour</p>

        <Button
          variant="gray"
          className="px-4 py-2 rounded-md  text-[16px] font-medium"
        >
          Message host
        </Button>

        <p className="mt-6 text-[16px] text-gray-600 border-t pt-4 flex items-start gap-2">
          <span>🔒</span>
          To help protect your payment, always use Staygenx to send money and
          communicate with hosts.
        </p>
      </div>
    </div>
  );
}
