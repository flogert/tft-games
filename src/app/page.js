'use client';

export default function HomePage() {
  const gameModes = [
    {
      title: 'Tacticians',
      description: 'Guess the name of the tactician shown.',
      link: '/tacticians',
      image: '/images/character.webp',
    },
    {
      title: 'Traits',
      description: 'Identify the TFT traits.',
      link: '/traits',
      image: '/images/arcana.svg',
    },
    {
      title: 'Augments',
      description: 'Test your knowledge of TFT augments.',
      link: '/augments',
      image: '/images/lotus.png',
    },
    {
      title: 'Champions',
      description: 'Guess the TFT champion by their image.',
      link: '/game-champion',
      image: '/images/tacticians.png',
    },
    {
      title: 'Abilities',
      description: 'Match the ability to the champion.',
      link: '/game-ability',
      image: '/images/tacticians.png',
    },
    {
      title: 'Items',
      description: 'Identify the item from the image.',
      link: '/items',
      image: '/images/tacticians.png',
    },
  ];

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-cover bg-slate-950 bg-center text-gray-800 font-custom"
      style={{ backgroundImage: `url('/images/tacticians.png')` }} // Add background image to the main element
    >
      <h1 className="text-5xl font-bold mb-3 text-white">TFTdle</h1>
      <p className="text-lg text-center mb-3 max-w-xl text-white">
        Choose a game mode and test your knowledge of Teamfight Tactics!
      </p>
      <div className="flex flex-wrap justify-center gap-6">
        {gameModes.map((mode, index) => (
          <a
            key={index}
            href={mode.link}
            className="relative flex flex-col items-center justify-center bg-slate-950 bg-center bg-cover h-60 w-72 rounded-lg transition-transform transform hover:scale-105"
            style={{ backgroundImage: `url(${mode.image})` }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg">
              <h2 className="text-amber-600 bg-white rounded-full px-6 text-2xl font-bold">{mode.title}</h2>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
