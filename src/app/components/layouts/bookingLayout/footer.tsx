import Button from '@/shadcn/ui/Button';
import { Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-sm text-gray-700 px-6 py-4 border-t">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left Links */}
        <div className="flex flex-wrap items-center gap-2">
          <span>© 2025 StaygenX, Inc.</span>
          <span>·</span>
          <a href="#" className="hover:underline">
            Privacy
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Terms
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Sitemap
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Company details
          </a>
        </div>

        {/* Right Settings */}
        <div className="flex items-center gap-4 text-gray-800">
          <Button className="flex items-center gap-1 hover:underline">
            <Globe size={16} />
            <span>English (IN)</span>
          </Button>
          <Button className="hover:underline">₹ INR</Button>
          <a href="#" className="hover:opacity-80"></a>
          <a href="#" className="hover:opacity-80"></a>
          <a href="#" className="hover:opacity-80"></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
