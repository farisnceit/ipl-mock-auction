# Contributing to IPL Auction Project

Thank you for your interest in contributing to the IPL Auction project! This document will guide you through the process of adding players and contributing to the codebase.

## Adding Players

### Player Data Structure

Players are stored in `data/players.json` and are organized by their roles. Here's the structure for each player:

```json
{
  "id": "unique_id",
  "name": "Player Name",
  "role": "batsmen | bowlers | allRounders | wicketKeepers",
  "basePrice": 20000000, // in Indian Rupees
  "country": "Country Name",
  "imageUrl": "https://example.com/player-image.jpg", // URL to player's image
  "stats": {
    "average": 45.5,
    "strikeRate": 135.2,
    "economy": 7.5,
    "wickets": 150,
    "matches": 100,
    "recentForm": 0.8,
    "dismissals": 50
  }
}
```

### Required Stats by Role

1. **Batsmen**:
   - average (batting average)
   - strikeRate (runs per 100 balls)
   - matches (number of matches played)
   - recentForm (performance in last 10 matches, 0-1)

2. **Bowlers**:
   - economy (runs per over)
   - wickets (total wickets)
   - matches (number of matches played)
   - recentForm (performance in last 10 matches, 0-1)

3. **All-Rounders**:
   - average (batting average)
   - strikeRate (runs per 100 balls)
   - economy (runs per over)
   - wickets (total wickets)
   - matches (number of matches played)
   - recentForm (performance in last 10 matches, 0-1)

4. **Wicket Keepers**:
   - average (batting average)
   - dismissals (catches + stumpings)
   - matches (number of matches played)
   - recentForm (performance in last 10 matches, 0-1)

### Adding a New Player

1. Open `data/players.json`
2. Find the appropriate role section (batsmen, bowlers, allRounders, or wicketKeepers)
3. Add your player following the structure above
4. Ensure all required stats are provided
5. Use realistic values for stats and base price
6. Add a valid image URL for the player

Example:
```json
{
  "batsmen": [
    {
      "id": "batsman_001",
      "name": "Virat Kohli",
      "role": "batsmen",
      "basePrice": 20000000,
      "country": "India",
      "imageUrl": "https://example.com/virat-kohli.jpg",
      "stats": {
        "average": 52.73,
        "strikeRate": 133.41,
        "matches": 237,
        "recentForm": 0.85
      }
    }
  ]
}
```

### Image Guidelines

1. **Image Requirements**:
   - Use high-quality images (minimum 200x200 pixels)
   - Square or 1:1 aspect ratio preferred
   - Clear, well-lit player photos
   - Professional cricket photos

2. **Image Hosting**:
   - Host images on a reliable CDN or image hosting service
   - Ensure images are publicly accessible
   - Use HTTPS URLs only
   - Optimize images for web use

3. **Naming Convention**:
   - Use lowercase letters
   - Replace spaces with hyphens
   - Include player's name and role
   - Example: `virat-kohli-batsman.jpg`

## Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow the existing code structure
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions focused and single-purpose

### Testing

- Test new features thoroughly
- Ensure the auction logic works correctly
- Verify player stats are displayed properly
- Check bid calculations are accurate

### Pull Request Process

1. Create a new branch for your changes
2. Make your changes following the guidelines
3. Test thoroughly
4. Submit a pull request with a clear description
5. Wait for review and address any feedback

## Project Structure

```
project/
├── app/                    # Next.js app directory
│   ├── auction/           # Auction page components
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
├── data/                  # JSON data files
├── lib/                   # Utility functions and types
└── public/               # Static assets
```

## Getting Started

1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm install`
4. Run the development server: `npm run dev`
5. Make your changes
6. Submit a pull request

## Questions?

If you have any questions about contributing or adding players, please open an issue in the repository. 