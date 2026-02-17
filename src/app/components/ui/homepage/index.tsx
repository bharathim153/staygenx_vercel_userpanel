import PropertySection from '../../propertycard';
import { IListing } from './store/type';

interface HomeSections {
  popularHomesInBengaluru: IListing[];
  weekendInPuducherry: IListing[];
  stayInDindugal: IListing[];
  nextMonthInHyderabad: IListing[];
}

interface HomPageProps {
  data: HomeSections;
}

function formatTitle(key: string) {
  switch (key) {
    case 'popularHomesInBengaluru':
      return 'Popular Homes in Bengaluru';
    case 'weekendInPuducherry':
      return 'Available in Puducherry this Weekend';
    case 'homesInPuducherry':
      return 'Homes In Puducherry';
    case 'stayInDindigul':
      return 'Stay In Dindigul';
    case 'nextMonthInHyderabad':
      return 'Next Month in Hyderabad';
    case 'placesToStayInErnakulam':
      return 'Places to Stay in Ernakulam';
    default:
      return key;
  }
}

export default function HomPage({ data }: HomPageProps) {
  console.log('Homepage data:', data);
  return (
    <div className="max-w-[1400px] mx-auto overflow-x-auto px-5">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="mb-0">
          <h2 className="text-[18px] font-[500] mb-4">{formatTitle(key)}</h2>
          {Array.isArray(value) && value.length > 0 ? (
            <PropertySection title={undefined} properties={value} />
          ) : (
            <div className="text-gray-500 text-center py-8 ">No data found</div>
          )}
        </div>
      ))}
    </div>
  );
}

// import { formatTitle } from '@/lib/utils';
// import PropertySection from '../../propertycard';
// import { IListing } from './store/type';

// export interface HomeSections {
//   popularHomesInBengaluru: IListing[];
//   weekendInPuducherry: IListing[];
//   stayInDindugal: IListing[];
//   nextMonthInHyderabad: IListing[];
// }

// interface HomPageProps {
//   data: HomeSections;
// }
// export default function HomPage({ data }: HomPageProps) {
//   console.log("Homepage data:", data);

//   return (
//     <div className="max-w-[1400px] mx-auto overflow-x-auto px-5">
//       {Object.entries(data)
//         .filter(([, value]) => value.length > 0)
//         .map(([key, value]) => (
//           <PropertySection
//             key={key}
//             title={formatTitle(key)}
//             properties={value}
//           />
//         ))}
//     </div>
//   );
// }
