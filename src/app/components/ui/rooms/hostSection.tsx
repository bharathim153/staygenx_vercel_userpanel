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
  desc?: string;
  cancellationPolicy?: string;
  hasCarbonMonoxideAlarm?: boolean;
  hasSmokeAlarm?: boolean;
  hasFireExtinguisher?: boolean;
  hasFirstAidKit?: boolean;
}

export default function HostSection({ host, desc }: HostSectionProps) {
  console.log('Host:', host);
  return (
    <div className="px-5">
      <div className="flex gap-3 py-3 border-b">
        <ImageComponent
          src={host?.userinfo?.profileImage || ''}
          alt="img"
          width={40}
          height={40}
          className="object-cover rounded-full w-[40px] h-[40px]"
        />
        <div>
          <p className="text-[15px]">
            Hosted by {host?.firstName} {host?.lastName}
          </p>
        </div>
      </div>
      {/* <div className="py-6 flex flex-col gap-5 border-b">
        <div className="flex gap-6 items-center">
          <div>
            <AlarmSmoke />
          </div>
          <div>
            <p
              className={`${hasCarbonMonoxideAlarm === false
                ? 'line-through text-gray-400 text-[15px] font-semibold'
                : 'text-gray-800 text-[15px] font-semibold'
                }`}
            >
              CarbonMonoxide Alarm
            </p>

          </div>
        </div>
        <div className="flex gap-6 items-center">
          <div>
            <FireExtinguisher />
          </div>
          <div>
            <p
              className={`${hasFireExtinguisher === false
                ? 'line-through text-gray-400 text-[15px] font-semibold'
                : 'text-gray-800 text-[15px] font-semibold'
                }`}
            >
              Fire Extinguisher
            </p>
          
          </div>
        </div>
        <div className="flex gap-6 items-center">
          <div>
            <BriefcaseMedical />
          </div>
          <div>
            <p
              className={`${hasFirstAidKit === false
                ? 'line-through text-gray-400 text-[15px] font-semibold'
                : 'text-gray-800 text-[15px] font-semibold'
                }`}
            >
              FirstAid Kit
            </p>
           
          </div>
        </div>
        <div className="flex gap-6 items-center">
          <div>
            <AlarmSmoke />
          </div>
          <div>
            <p
              className={`${hasSmokeAlarm === false
                ? 'line-through text-gray-400 text-[15px] font-semibold'
                : 'text-gray-800 text-[15px] font-semibold'
                }`}
            >
              Smoke Alarm
            </p>
            
          </div>
        </div>
        <div className="flex gap-6 items-center">
          <div>
            <Calendar />
          </div>
          <div>
            <p className="font-semibold text-[15px]">Cancellation </p>
            <p className="text-[#6a6a6a]">{cancellationPolicy || ''}</p>
          </div>
        </div>
      </div> */}
      <div className="py-6 border-b">{desc || ''}</div>
    </div>
  );
}
