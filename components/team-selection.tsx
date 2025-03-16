"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import teams from '@/data/teams.json';
import { Team } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function TeamSelection() {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const router = useRouter();

  const handleTeamSelect = (team: Team) => {
    setSelectedTeam(team);
  };

  const handleStartAuction = () => {
    if (selectedTeam) {
      router.push(`/auction?team=${selectedTeam.id}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">Select Your Team</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.teams.map((team) => (
          <Card
            key={team.id}
            className={`p-6 cursor-pointer transition-all ${
              selectedTeam?.id === team.id
                ? 'ring-2 ring-primary'
                : 'hover:shadow-lg'
            }`}
            onClick={() => handleTeamSelect(team)}
            style={{
              backgroundColor: selectedTeam?.id === team.id
                ? `${team.color}22`
                : 'white'
            }}
          >
            <div className="flex items-center space-x-4">
              <div
                className="w-16 h-16 rounded-full bg-cover bg-center"
                style={{ backgroundImage: `url(${team.logo})` }}
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                <p className="text-sm text-gray-600">{team.shortName}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Button
          size="lg"
          onClick={handleStartAuction}
          disabled={!selectedTeam}
          className="px-8"
        >
          Start Auction
        </Button>
      </div>
    </div>
  );
}