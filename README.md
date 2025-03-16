# IPL Auction 2025

An interactive IPL auction simulation built with Next.js, TypeScript, and React. Experience the thrill of the IPL auction with realistic bidding mechanics, AI-powered team decisions, and a modern user interface.

<img src="/public/og-image.png" alt="IPL Auction 2025" title="IPL Auction 2025" width="800" height="auto">

## Features

- 🎮 **Interactive Auction**: Real-time bidding with a 30-second timer
- 🤖 **AI-Powered Bidding**: Teams make strategic decisions based on:
  - Player statistics and value
  - Team composition needs
  - Remaining purse
  - Auction phase
- 🎨 **Modern UI**: Clean, responsive design with dark/light mode
- 📊 **Real-time Updates**: Live bid history and team statistics
- ⏯️ **Pause/Resume**: Control the auction flow
- 💰 **Smart Bidding**: Automatic bid increments and purse management
- 📱 **Mobile Responsive**: Works on all devices

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Hooks
- **Theme**: next-themes

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ipl-auction.git
   cd ipl-auction
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Usage

1. Select your team from the URL parameter: `?team=team_id`
2. Start the auction by clicking "Start Bidding"
3. Place bids during the 30-second timer
4. Use the pause/resume button to control the auction flow
5. Monitor team purses and player acquisitions

## Project Structure

```
project/
├── app/                    # Next.js app directory
│   ├── auction/           # Auction page components
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── bid-controls.tsx   # Bidding interface
│   ├── bid-history.tsx    # Bid history display
│   ├── player-card.tsx    # Player information
│   ├── status-bar.tsx     # Auction status
│   ├── team-card.tsx      # Team information
│   ├── theme-toggle.tsx   # Theme switcher
│   └── timer.tsx          # Countdown timer
├── data/                  # JSON data files
│   ├── players.json       # Player database
│   └── teams.json         # Team information
├── lib/                   # Utility functions and types
│   ├── constants.ts       # Auction constants
│   └── types.ts           # TypeScript types
└── public/               # Static assets
```

## Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for details on:

- Adding new players
- Code style guidelines
- Pull request process
- Development setup

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- IPL for inspiration
- All contributors who help improve this project
- The Next.js and React communities

## Support

If you encounter any issues or have questions, please:

1. Check the [Issues](https://github.com/yourusername/ipl-auction/issues) page
2. Create a new issue if needed
3. Join our community discussions

## Roadmap

- [ ] Add player images
- [ ] Implement team logos
- [ ] Add sound effects
- [ ] Create auction history
- [ ] Add player categories
- [ ] Implement team strategies
- [ ] Add multiplayer support

## Contributing to the Roadmap

We welcome suggestions for new features! Please:

1. Check existing issues
2. Create a new issue with your proposal
3. Follow our contribution guidelines
4. Submit a pull request

## Credits

Created with ❤️ by [Your Name/Organization] 
