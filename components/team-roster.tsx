"use client";

import { TeamState } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { List } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CURRENCY } from "@/lib/constants";

interface TeamRosterProps {
  team: TeamState;
}

export function TeamRoster({ team }: TeamRosterProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-2"
          disabled={false}
        >
          <List className="w-4 h-4 mr-1" />
          View Squad
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{team.name} Squad</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-2 mt-4">
          {team.players.map(player => (
            <Card key={player.id} className="p-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{player.name}</h3>
                  <p className="text-sm text-gray-500">{player.role}</p>
                </div>
                <p className="text-sm">{CURRENCY.SYMBOL}{(player.basePrice / CURRENCY.CONVERSION).toFixed(1)} {CURRENCY.UNIT}</p>
              </div>
            </Card>
          ))}
          {team.players.length === 0 && (
            <p className="text-gray-500 text-center py-4">No players in squad yet</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 