import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Try the Look — Runway | DRIP',
  description: 'Six looks, styled head to toe. Explore the runway, isolate a look, and tap a pin to see the piece.',
};

export default function RunwayPage() {
  return (
    <div className="w-full h-screen overflow-hidden bg-white">
      <iframe
        src="/runway.html"
        title="Try the Look — Runway"
        className="w-full h-full border-none m-0 p-0 block"
        style={{ width: '100%', height: '100%', border: 'none' }}
        allow="autoplay; clipboard-write"
      />
    </div>
  );
}
