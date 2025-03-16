"use client";

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuctionState, Player, TeamState, BidState } from '@/lib/types';
import players from '@/data/players.json';
import teams from '@/data/teams.json';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from "@/components/theme-toggle";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TeamCard } from '@/components/team-card';
import { PlayerCard } from '@/components/player-card';
import { BidControls } from '@/components/bid-controls';
import { BidHistory } from '@/components/bid-history';
import { Timer } from '@/components/timer';
import { StatusBar } from '@/components/status-bar';
import { CURRENCY, AUCTION_CONSTANTS } from '@/lib/constants';

function AuctionPageContent() {
  const searchParams = useSearchParams();
  const selectedTeamId = searchParams.get('team');
  
  const [auctionState, setAuctionState] = useState<AuctionState>(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('auctionState');
      if (savedState) {
        return JSON.parse(savedState);
      }
    }
    return {
      selectedTeam: null,
      currentPlayer: null,
      teams: [],
      availablePlayers: {
        batsmen: [],
        allRounders: [],
        wicketKeepers: [],
        bowlers: []
      },
      bidState: null,
      auctionQueue: [],
      isPaused: false
    };
  });

  useEffect(() => {
    if (selectedTeamId && !auctionState.selectedTeam) {
      const initialTeams = teams.teams.map(team => ({
        id: team.id,
        name: team.name,
        purse: AUCTION_CONSTANTS.INITIAL_PURSE,
        players: []
      }));

      // Create initial auction queue
      const categories = ['batsmen', 'wicketKeepers', 'allRounders', 'bowlers'] as const;
      const queue: Player[] = categories.flatMap(category => 
        players[category] as Player[]
      ).sort(() => Math.random() - 0.5);

      setAuctionState(prev => ({
        ...prev,
        teams: initialTeams,
        selectedTeam: initialTeams.find(team => team.id === selectedTeamId) || null,
        auctionQueue: queue
      }));
    }
  }, [selectedTeamId, auctionState.selectedTeam]);

  useEffect(() => {
    localStorage.setItem('auctionState', JSON.stringify(auctionState));
  }, [auctionState]);

  const pauseAuction = () => {
    setAuctionState(prev => ({
      ...prev,
      isPaused: !prev.isPaused,
      bidState: prev.bidState ? {
        ...prev.bidState,
        timeLeft: prev.bidState.timeLeft // Preserve the current time when pausing
      } : null
    }));
  };

  const startBidding = (player: Player) => {
    const initialBidState: BidState = {
      currentBid: player.basePrice,
      currentTeam: '',
      biddingTeams: [],
      timeLeft: AUCTION_CONSTANTS.BID_TIMER
    };

    setAuctionState(prev => ({
      ...prev,
      currentPlayer: player,
      bidState: initialBidState,
      isPaused: false
    }));

    // Start computer bidding immediately if not paused
    if (!auctionState.isPaused) {
      setTimeout(() => {
        const randomTeam = getRandomTeamForBidding();
        if (randomTeam) {
          placeBid(randomTeam.id);
        }
      }, Math.random() * AUCTION_CONSTANTS.COMPUTER_BID_DELAY.MAX + AUCTION_CONSTANTS.COMPUTER_BID_DELAY.MIN);
    }
  };

  const calculateBidProbability = (team: TeamState, currentBid: number, player: Player) => {
    let probability = 0.5; // Base probability

    // Factor 1: Team's remaining purse
    const purseRatio = team.purse / AUCTION_CONSTANTS.INITIAL_PURSE;
    probability += purseRatio * 0.2; // Higher purse increases probability

    // Factor 2: Team's squad needs
    const roleCount = team.players.filter(p => p.role === player.role).length;
    const needsRole = {
      'batsmen': 6,
      'bowlers': 6,
      'allRounders': 3,
      'wicketKeepers': 2
    }[player.role] || 4;
    
    if (roleCount < needsRole) {
      probability += 0.2; // Increase probability if team needs this role
    }

    // Factor 3: Player value assessment
    const valueScore = calculatePlayerValue(player);
    const bidValueRatio = valueScore / (currentBid / CURRENCY.CONVERSION);
    probability += bidValueRatio * 0.2;

    // Factor 4: Auction phase
    const auctionProgress = 1 - (auctionState.auctionQueue.length / AUCTION_CONSTANTS.TOTAL_PLAYERS);
    if (auctionProgress > 0.7 && team.purse > AUCTION_CONSTANTS.INITIAL_PURSE * 0.4) {
      probability += 0.2; // More aggressive bidding in later stages if purse available
    }

    return Math.min(Math.max(probability, 0), 1); // Ensure probability is between 0 and 1
  };

  const calculatePlayerValue = (player: Player) => {
    let value = player.basePrice / CURRENCY.CONVERSION;
    
    // Add value based on stats
    if (player.stats) {
      switch (player.role) {
        case 'batsmen':
          value += ((player.stats.average || 0) * 0.4 + (player.stats.strikeRate || 0) * 0.3);
          break;
        case 'bowlers':
          value += ((300 - (player.stats.economy || 0)) * 0.4 + (player.stats.wickets || 0) * 0.3);
          break;
        case 'allRounders':
          value += (
            (player.stats.average || 0) * 0.2 + 
            (player.stats.wickets || 0) * 0.2 + 
            (player.stats.strikeRate || 0) * 0.2
          );
          break;
        case 'wicketKeepers':
          value += ((player.stats.average || 0) * 0.3 + (player.stats.dismissals || 0) * 0.3);
          break;
      }
    }

    // Adjust value based on recent form and experience
    if (player.stats?.matches && player.stats.matches > 50) value *= 1.2;
    if (player.stats?.recentForm && player.stats.recentForm > 0.7) value *= 1.3;

    return value;
  };

  const getRandomTeamForBidding = () => {
    if (!auctionState.bidState || !auctionState.currentPlayer) return null;
    
    const eligibleTeams = auctionState.teams.filter(team => 
      team.id !== auctionState.selectedTeam?.id &&
      team.id !== auctionState.bidState?.currentTeam &&
      team.purse >= (auctionState.bidState?.currentBid ?? 0) + AUCTION_CONSTANTS.MIN_BID_INCREMENT &&
      team.players.length < AUCTION_CONSTANTS.MAX_PLAYERS_PER_TEAM
    );

    // Calculate probabilities for each team
    const teamsWithProbabilities = eligibleTeams.map(team => ({
      team,
      probability: calculateBidProbability(
        team,
        auctionState.bidState!.currentBid,
        auctionState.currentPlayer!
      )
    }));

    // Sort by probability and filter those above threshold
    const interestedTeams = teamsWithProbabilities
      .filter(({ probability }) => probability > 0.3)
      .sort((a, b) => b.probability - a.probability);

    if (interestedTeams.length === 0) return null;
    
    // Select team based on weighted probabilities
    const totalProbability = interestedTeams.reduce((sum, { probability }) => sum + probability, 0);
    let random = Math.random() * totalProbability;
    
    for (const { team, probability } of interestedTeams) {
      random -= probability;
      if (random <= 0) return team;
    }

    return interestedTeams[0].team;
  };

  const placeBid = useCallback((teamId: string) => {
    if (!auctionState.bidState || !auctionState.currentPlayer || auctionState.isPaused) return;

    const increment = auctionState.bidState.currentBid < 100000000 ? 
      AUCTION_CONSTANTS.MIN_BID_INCREMENT : 
      AUCTION_CONSTANTS.MAX_BID_INCREMENT;
    const newBid = auctionState.bidState.currentBid + increment;

    const team = auctionState.teams.find(t => t.id === teamId);
    if (!team || team.purse < newBid) return;

    // Update the team's purse immediately when placing a bid
    const updatedTeams = auctionState.teams.map(t => {
      if (t.id === teamId) {
        return {
          ...t,
          purse: t.purse - newBid,
          players: [...t.players, auctionState.currentPlayer!]
        };
      }
      return t;
    });

    setAuctionState(prev => ({
      ...prev,
      teams: updatedTeams,
      bidState: {
        ...prev.bidState!,
        currentBid: newBid,
        currentTeam: teamId,
        timeLeft: AUCTION_CONSTANTS.BID_TIMER,
        biddingTeams: Array.from(new Set([...prev.bidState!.biddingTeams, teamId]))
      }
    }));

    // Enhanced computer bidding logic
    setTimeout(() => {
      if (auctionState.isPaused) return;

      const randomTeam = getRandomTeamForBidding();
      if (randomTeam) {
        const bidProbability = calculateBidProbability(
          randomTeam,
          auctionState.bidState!.currentBid,
          auctionState.currentPlayer!
        );

        // Add some randomness to bid timing based on probability
        const delay = Math.random() * 
          (bidProbability > 0.7 ? 
            AUCTION_CONSTANTS.COMPUTER_BID_DELAY.MIN : 
            AUCTION_CONSTANTS.COMPUTER_BID_DELAY.MAX);

        setTimeout(() => {
          if (bidProbability > Math.random() && !auctionState.isPaused) {
            placeBid(randomTeam.id);
          }
        }, delay);
      }
    }, AUCTION_CONSTANTS.COMPUTER_BID_DELAY.MIN);
  }, [auctionState.bidState, auctionState.currentPlayer, auctionState.teams, auctionState.isPaused]);

  const getCurrentBidderName = () => {
    if (!auctionState.bidState?.currentTeam) return "No bids yet";
    const team = auctionState.teams.find(t => t.id === auctionState.bidState?.currentTeam);
    return team?.name || "Unknown Team";
  };

  const resetAuction = () => {
    // Clear localStorage
    localStorage.removeItem('auctionState');
    
    // Reset to initial state
    const initialTeams = teams.teams.map(team => ({
      id: team.id,
      name: team.name,
      purse: AUCTION_CONSTANTS.INITIAL_PURSE,
      players: []
    }));

    // Create initial auction queue
    const categories = ['batsmen', 'wicketKeepers', 'allRounders', 'bowlers'] as const;
    const queue: Player[] = categories.flatMap(category => 
      players[category] as Player[]
    ).sort(() => Math.random() - 0.5);

    setAuctionState({
      selectedTeam: initialTeams.find(team => team.id === selectedTeamId) || null,
      currentPlayer: null,
      teams: initialTeams,
      availablePlayers: {
        batsmen: [],
        allRounders: [],
        wicketKeepers: [],
        bowlers: []
      },
      bidState: null,
      auctionQueue: queue,
      isPaused: false
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white p-4 sm:p-6 md:p-8">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">IPL Auction 2025</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="w-full sm:w-auto">
                  Reset Auction
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Auction</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will reset the entire auction to its initial state. All bids and team selections will be cleared. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={resetAuction}>Reset</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
          {/* Left sidebar - Teams info */}
          <div className="lg:col-span-3 space-y-4">
            {/* Your Team */}
            {auctionState.selectedTeam && (
              <TeamCard team={auctionState.selectedTeam} isSelectedTeam />
            )}

            {/* All Teams */}
            <Card className="p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-sm">
              <h2 className="text-lg sm:text-xl font-bold mb-4">All Teams</h2>
              <div className="space-y-3">
                {auctionState.teams.map(team => (
                  <TeamCard key={team.id} team={team} />
                ))}
              </div>
            </Card>

            {/* Upcoming Players */}
            <Card className="p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-sm">
              <h2 className="text-lg sm:text-xl font-bold mb-4">Next in Queue</h2>
              <div className="space-y-2">
                {auctionState.auctionQueue.slice(0, 3).map(player => (
                  <p key={player.id} className="text-sm text-gray-600 dark:text-gray-400">
                    {player.name} ({player.role})
                  </p>
                ))}
              </div>
            </Card>
          </div>

          {/* Main content */}
          <div className="lg:col-span-9">
            {/* Status Bar */}
            <StatusBar
              isAuctionActive={!!auctionState.currentPlayer}
              onStartAuction={() => startBidding(auctionState.auctionQueue[0])}
              onPauseAuction={pauseAuction}
              onResetAuction={resetAuction}
              currentPlayerIndex={auctionState.auctionQueue.length}
              totalPlayers={auctionState.auctionQueue.length + (auctionState.currentPlayer ? 1 : 0)}
              isPaused={auctionState.isPaused}
            />

            {/* Current Auction */}
            {auctionState.currentPlayer && auctionState.bidState ? (
              <Card className="p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-sm mb-4 sm:mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold">{auctionState.currentPlayer.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{auctionState.currentPlayer.role}</p>
                    <p className="text-gray-600 dark:text-gray-400">{auctionState.currentPlayer.country}</p>
                    <div className="mt-4">
                      <h3 className="font-semibold mb-2">Stats</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {Object.entries(auctionState.currentPlayer.stats).map(([key, value]) => (
                          <p key={key} className="text-sm text-gray-600 dark:text-gray-400">
                            {key.charAt(0).toUpperCase() + key.slice(1)}: {String(value)}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="mb-4">
                      <p className="text-lg sm:text-xl font-bold">
                        Current Bid: {CURRENCY.SYMBOL}{(auctionState.bidState.currentBid / CURRENCY.CONVERSION).toFixed(1)} {CURRENCY.UNIT}
                      </p>
                      <p className="text-base sm:text-lg text-green-600 dark:text-green-400">
                        Current Bidder: {getCurrentBidderName()}
                      </p>
                      <div className="mt-2">
                        <Timer
                          duration={AUCTION_CONSTANTS.BID_TIMER}
                          onComplete={() => {
                            if (auctionState.currentPlayer && auctionState.bidState?.currentTeam) {
                              // Get next player from queue
                              const nextPlayer = auctionState.auctionQueue[0];
                              const remainingQueue = auctionState.auctionQueue.slice(1);

                              // Auto-start next player auction after a delay
                              if (nextPlayer) {
                                setTimeout(() => startBidding(nextPlayer), AUCTION_CONSTANTS.NEXT_PLAYER_DELAY);
                              }

                              setAuctionState(prev => ({
                                ...prev,
                                currentPlayer: null,
                                bidState: null,
                                auctionQueue: remainingQueue,
                                isPaused: false
                              }));
                            } else {
                              setAuctionState(prev => ({
                                ...prev,
                                currentPlayer: null,
                                bidState: null,
                                isPaused: false
                              }));
                            }
                          }}
                          isActive={!!auctionState.bidState && !auctionState.isPaused}
                          currentTime={auctionState.bidState?.timeLeft}
                          onReset={() => {
                            if (auctionState.bidState) {
                              setAuctionState(prev => ({
                                ...prev,
                                bidState: {
                                  ...prev.bidState!,
                                  timeLeft: AUCTION_CONSTANTS.BID_TIMER
                                }
                              }));
                            }
                          }}
                        />
                      </div>
                    </div>
                    {auctionState.selectedTeam && (
                      <BidControls
                        currentBid={auctionState.bidState.currentBid / CURRENCY.CONVERSION}
                        onPlaceBid={(amount) => placeBid(auctionState.selectedTeam!.id)}
                        onPass={() => {}}
                        isDisabled={
                          auctionState.selectedTeam.purse < auctionState.bidState.currentBid + AUCTION_CONSTANTS.MIN_BID_INCREMENT ||
                          auctionState.bidState.currentTeam === auctionState.selectedTeam.id ||
                          auctionState.selectedTeam.players.length >= AUCTION_CONSTANTS.MAX_PLAYERS_PER_TEAM
                        }
                      />
                    )}
                  </div>
                </div>
              </Card>
            ) : (
              <PlayerCard
                player={auctionState.auctionQueue[0] || null}
                onStartBid={() => auctionState.auctionQueue[0] && startBidding(auctionState.auctionQueue[0])}
                isDisabled={!!auctionState.currentPlayer || !auctionState.auctionQueue.length}
              />
            )}

            {/* Bid History */}
            {auctionState.bidState && (
              <BidHistory
                bids={auctionState.bidState.biddingTeams.map(teamId => ({
                  team: auctionState.teams.find(t => t.id === teamId)?.name || "Unknown Team",
                  amount: auctionState.bidState?.currentBid || 0,
                  timestamp: new Date()
                }))}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuctionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white p-4 sm:p-6 md:p-8">
        <div className="container mx-auto">
          <div className="flex justify-center items-center h-[60vh]">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Loading Auction...</h2>
              <p className="text-gray-600 dark:text-gray-400">Please wait while we set up the auction.</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <AuctionPageContent />
    </Suspense>
  );
}