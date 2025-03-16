"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CURRENCY } from "@/lib/constants";

interface BidControlsProps {
  currentBid: number;
  onPlaceBid: (amount: number) => void;
  onPass: () => void;
  isDisabled?: boolean;
}

export function BidControls({ currentBid, onPlaceBid, onPass, isDisabled = false }: BidControlsProps) {
  const handleBid = () => {
    const bidAmount = currentBid + 0.1;
    onPlaceBid(bidAmount);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={currentBid.toFixed(1)}
          readOnly
          className="w-32 text-center"
          disabled={isDisabled}
        />
        <span className="text-sm font-medium">{CURRENCY.UNIT}</span>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={handleBid}
          disabled={isDisabled}
          className="bg-green-600 hover:bg-green-700"
        >
          Place Bid
        </Button>
        <Button
          onClick={onPass}
          disabled={isDisabled}
          variant="outline"
        >
          Pass
        </Button>
      </div>
    </div>
  );
} 