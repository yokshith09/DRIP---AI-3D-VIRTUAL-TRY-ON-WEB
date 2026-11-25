import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import WardrobeRack from '@/components/WardrobeRack';

export const metadata: Metadata = {
  title: 'Digital Wardrobe • Clothes Rail 3D | DRIP Atelier',
  description: 'Interactive 3D chrome clothes rail with Sudiv streetwear capsule garments. Slide, inspect fabric weights, and try on.',
};

export default function WardrobePage() {
  return (
    <div className="min-h-screen bg-[#fbfbfb] flex flex-col">
      <Navbar />
      <main className="flex-1 w-full relative">
        <WardrobeRack />
      </main>
    </div>
  );
}
