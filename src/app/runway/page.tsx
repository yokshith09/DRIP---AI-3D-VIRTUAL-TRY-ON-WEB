import { Metadata } from 'next';
import Runway3D from '@/components/Runway3D';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Try the Look — Runway 3D | DRIP Atelier',
  description: 'Six looks, styled head to toe. Explore the turning 3D ring, isolate a look, and tap a pin to inspect the piece.',
};

export default function RunwayPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 w-full relative">
        <Runway3D />
      </main>
    </div>
  );
}
