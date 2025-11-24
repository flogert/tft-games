# TFTdle - Teamfight Tactics Guessing Games

Test your knowledge of Teamfight Tactics (TFT) with this collection of interactive guessing games!

## 🎮 Game Modes

Currently available:
- **Augments**: Guess the name of the augment based on its icon.
- **Tacticians**: Identify the Little Legend or Chibi Champion shown.
- **Traits**: Recognize the trait symbol.

Coming soon:
- Champions
- Abilities
- Items

## ✨ Features

- **Interactive Gameplay**: Fast-paced guessing with a 60-second timer.
- **Score Tracking**: Earn points for correct answers.
- **High Scores**: Track your best runs locally.
- **Visuals**: Beautiful UI with Framer Motion animations and a glassmorphism aesthetic.
- **Sound Effects**: Audio feedback for correct and incorrect guesses.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Data**: Riot Games Data Dragon & Community Dragon

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/flogert/tft-games.git
   cd tft-games
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

```
src/
├── app/
│   ├── augments/      # Augments game logic
│   ├── tacticians/    # Tacticians game logic
│   ├── traits/        # Traits game logic
│   ├── styles/        # Global styles
│   └── page.js        # Main menu
├── public/
│   ├── data/          # JSON data files
│   ├── images/        # Static assets
│   └── sounds/        # Audio files
```

## ⚠️ Disclaimer

TFTdle isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.

---

Created by [flogert](https://github.com/flogert)
