"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CURRENCY } from "@/lib/constants";

interface BidHistoryProps {
  bids: Array<{
    team: string;
    amount: number;
    timestamp: Date;
  }>;
}

export function BidHistory({ bids }: BidHistoryProps) {
  return (
    <Card className="p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-sm">
      <h3 className="text-lg sm:text-xl font-bold mb-4">Bid History</h3>
      <ScrollArea className="h-[200px] pr-4">
        <div className="space-y-2">
          {bids.map((bid, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700"
            >
              <span className="font-medium">{bid.team}</span>
              <span className="text-sm">
                {CURRENCY.SYMBOL}{(bid.amount / CURRENCY.CONVERSION).toFixed(1)} {CURRENCY.UNIT}
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
} 