"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";

interface StatusBarProps {
  isAuctionActive: boolean;
  onStartAuction: () => void;
  onPauseAuction: () => void;
  onResetAuction: () => void;
  currentPlayerIndex: number;
  totalPlayers: number;
  isPaused: boolean;
}

export function StatusBar({
  isAuctionActive,
  onStartAuction,
  onPauseAuction,
  onResetAuction,
  currentPlayerIndex,
  totalPlayers,
  isPaused
}: StatusBarProps) {
  return (
    <Card className="p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Player {currentPlayerIndex + 1} of {totalPlayers}
          </div>
          <div className="text-sm font-medium">
            Status: {isAuctionActive ? "Auction in Progress" : "Auction Paused"}
          </div>
        </div>
        <div className="flex gap-2">
          {isAuctionActive ? (
            <Button
              onClick={onPauseAuction}
              variant="outline"
              className="gap-2"
            >
              <Pause className="h-4 w-4" />
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
          ) : (
            <Button
              onClick={onStartAuction}
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              Start
            </Button>
          )}
          <Button
            onClick={onResetAuction}
            variant="destructive"
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>
    </Card>
  );
} 