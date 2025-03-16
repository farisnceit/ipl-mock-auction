export interface PlayerStats {
  average?: number;
  strikeRate?: number;
  economy?: number;
  wickets?: number;
  dismissals?: number;
  matches?: number;
  recentForm?: number;
  // Add other relevant stats
}

export interface Player {
  id: string;
  name: string;
  role: 'batsmen' | 'bowlers' | 'allRounders' | 'wicketKeepers';
  basePrice: number;
  country: string;
  imageUrl?: string; // Optional image URL for the player
  stats: PlayerStats;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  color: string;
  logo: string;
}

export interface TeamState {
  id: string;
  name: string;
  purse: number;
  players: Player[];
}

export interface BidState {
  currentBid: number;
  currentTeam: string;
  biddingTeams: string[];
  timeLeft: number;
}

export interface AuctionState {
  selectedTeam: TeamState | null;
  currentPlayer: Player | null;
  teams: TeamState[];
  availablePlayers: {
    batsmen: Player[];
    allRounders: Player[];
    wicketKeepers: Player[];
    bowlers: Player[];
  };
  bidState: BidState | null;
  auctionQueue: Player[];
  isPaused: boolean;
}