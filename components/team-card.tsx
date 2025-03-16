"use client";

import { TeamState } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Users, DollarSign, UserCheck } from "lucide-react";
import { TeamRoster } from "./team-roster";
import { CURRENCY } from "@/lib/constants";

interface TeamCardProps {
  team: TeamState;
  isSelectedTeam?: boolean;
}

export function TeamCard({ team, isSelectedTeam = false }: TeamCardProps) {
  return (
    <Card className={`p-4 sm:p-6 bg-white dark:bg-gray-800 ${isSelectedTeam ? 'border-green-500 border-2' : ''} shadow-sm`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4">
        <h2 className="text-lg sm:text-xl font-bold flex items-center">
          {isSelectedTeam ? (
            <>
              <UserCheck className="w-5 h-5 mr-2" />
              Your Team
            </>
          ) : (
            team.name
          )}
        </h2>
        <TeamRoster team={team} />
      </div>
      <p className="text-base sm:text-lg flex items-center">
        <DollarSign className="w-4 h-4 mr-1" />
        {CURRENCY.SYMBOL}{(team.purse / CURRENCY.CONVERSION).toFixed(1)} {CURRENCY.UNIT}
      </p>
      <p className="text-sm mt-2 flex items-center">
        <Users className="w-4 h-4 mr-1" />
        {team.players.length}/25
      </p>
    </Card>
  );
} 