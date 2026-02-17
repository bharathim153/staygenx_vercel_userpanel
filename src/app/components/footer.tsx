'use client';

import TabsComponent from '@/shadcn/ui/tabs';

const uniqueStays = [
  { title: 'Yurt Rentals', location: 'United States' },
  { title: 'Yurt Rentals', location: 'United Kingdom' },
  { title: 'Castle Rentals', location: 'United States' },
  { title: 'Houseboats', location: 'United States' },
  { title: 'Holiday Caravans', location: 'United Kingdom' },
  { title: 'Private Island Rentals', location: 'United States' },
  { title: 'Farm Houses', location: 'United States' },
  { title: 'Farm Cottages', location: 'United Kingdom' },
  { title: 'Cabin Rentals', location: 'Australia' },
  { title: 'Luxury Cabins', location: 'United Kingdom' },
  { title: 'Luxury Cabins', location: 'United States' },
  { title: 'Holiday Chalets', location: 'United Kingdom' },
  { title: 'Cottage Rentals', location: 'United States' },
  { title: 'Holiday Cottages', location: 'United Kingdom' },
  { title: 'Mansion Rentals', location: 'United States' },
  { title: 'Villa Rentals', location: 'United Kingdom' },
  { title: 'Holiday Bungalows', location: 'United Kingdom' },
];

const categorieslist = [
  { title: 'Amazing pools' },
  { title: 'Arctic' },
  { title: 'Camping' },
  { title: 'Camper vans' },
  { title: 'Castles' },
  { title: 'Containers' },
  { title: 'Countryside' },
  { title: 'Design' },
  { title: 'Earth homes' },
  { title: 'Farms' },
  { title: 'National parks' },
  { title: 'Vineyards' },
  { title: 'OMG!' },
  { title: 'Tiny homes' },
  { title: 'Towers' },
  { title: 'Windmills' },
  { title: 'Luxe' },
];

const footerLinks = {
  Support: [
    'Help Centre',
    'AirCover',
    'Anti-discrimination',
    'Disability support',
    'Cancellation options',
    'Report neighbourhood concern',
  ],
  Hosting: [
    'StaygenX your home',
    'AirCover for Hosts',
    'Hosting resources',
    'Community forum',
    'Hosting responsibly',
    'Join a free Hosting class',
    'Find a co-host',
  ],
  StaygenX: [
    '2025 Summer Release',
    'Newsroom',
    'New features',
    'Careers',
    'Investors',
    'StaygenX.org emergency stays',
  ],
};

export default function Footer({ categories = true }) {
  const tabs = [
    {
      label: 'Unique stays',
      value: 'unique',
      content: (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6">
          {uniqueStays.map((item, idx) => (
            <div key={idx}>
              <p className="font-medium">{item.title}</p>
              <p className="text-gray-500">{item.location}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      label: 'Categories',
      value: 'categories',
      content: (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6">
          {categorieslist.map((item, idx) => (
            <div key={idx}>
              <p className="font-medium">{item.title}</p>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className=" space-y-10 text-sm text-gray-700 bg-gray-100  border-t">
      {/* Tabs Section */}
      {categories && (
        <div className="p-8">
          <h1 className="text-2xl font-semibold mb-6">
            Inspiration for future getaways
          </h1>
          <div className="flex items-center ">
            <TabsComponent tabs={tabs} justify="justify-start" />
          </div>
        </div>
      )}

      {/* Footer Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 p-8">
        {Object.entries(footerLinks).map(([section, links]) => (
          <div key={section}>
            <h3 className="font-semibold mb-3">{section}</h3>
            <ul className="space-y-2">
              {links.map(link => (
                <li key={link} className="hover:underline cursor-pointer">
                  {link}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
