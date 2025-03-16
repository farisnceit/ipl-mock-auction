import TeamSelection from '@/components/team-selection';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">IPL Auction Simulator</h1>
        <TeamSelection />
      </div>
    </div>
  );
}