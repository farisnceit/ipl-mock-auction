export const AUCTION_CONSTANTS = {
  INITIAL_PURSE: 1200000000,
  MIN_BID_INCREMENT: 10000000,
  MAX_BID_INCREMENT: 20000000,
  BID_TIMER: 10,
  MAX_PLAYERS_PER_TEAM: 25,
  COMPUTER_BID_CHANCE: 0.7,
  COMPUTER_BID_DELAY: {
    MIN: 1000,
    MAX: 3000
  },
  NEXT_PLAYER_DELAY: 2000,
  TOTAL_PLAYERS: 160,
  ROLE_REQUIREMENTS: {
    batsmen: 6,
    bowlers: 6,
    allRounders: 3,
    wicketKeepers: 2
  }
} as const;

export const PLAYER_CATEGORIES = ['batsmen', 'wicketKeepers', 'allRounders', 'bowlers'] as const;

export const CURRENCY = {
  SYMBOL: '₹',
  CONVERSION: 10000000,
  UNIT: 'Cr'
} as const; 