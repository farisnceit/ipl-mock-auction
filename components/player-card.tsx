"use client";

import { Player } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CURRENCY } from "@/lib/constants";
import Image from "next/image";

interface PlayerCardProps {
  player: Player | null;
  onStartBid: () => void;
  isDisabled?: boolean;
}

export function PlayerCard({ player, onStartBid, isDisabled = false }: PlayerCardProps) {
  if (!player) {
    return (
      <Card className="p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-sm">
        <div className="text-center text-gray-500 dark:text-gray-400">
          No player available
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="flex items-start gap-4">
          {/* Player Image */}
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
            {player.imageUrl ? (
              <Image
                src={player.imageUrl}
                alt={player.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 96px, 128px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl sm:text-3xl font-bold text-gray-600 dark:text-gray-300">
                {player.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold">{player.name}</h2>
            <p className="text-gray-600 dark:text-gray-400 capitalize">{player.role}</p>
            <p className="text-gray-600 dark:text-gray-400">{player.country}</p>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <div className="mb-4">
            <p className="text-lg sm:text-xl font-bold">
              Base Price: {CURRENCY.SYMBOL}{(player.basePrice / CURRENCY.CONVERSION).toFixed(1)} {CURRENCY.UNIT}
            </p>
          </div>
          <Button
            onClick={onStartBid}
            disabled={isDisabled}
            className="w-full sm:w-auto"
          >
            Start Bidding
          </Button>
        </div>
      </div>
    </Card>
  );
} 