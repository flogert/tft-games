'use client';
import { motion } from 'framer-motion';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gaming-dark text-white font-custom relative overflow-hidden">
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-20 bg-cover bg-center"
        style={{ backgroundImage: `url('/images/tacticians.png')` }}
      />
      
      <motion.div 
        className="z-10 flex flex-col items-center w-full max-w-6xl px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-6xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-gaming-accent to-yellow-200 drop-shadow-lg"
          variants={itemVariants}
        >
          TFTdle
        </motion.h1>
        <motion.p 
          className="text-xl text-center mb-12 max-w-2xl text-gray-300"
          variants={itemVariants}
        >
          Test your knowledge of Teamfight Tactics across multiple game modes!
        </motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {gameModes.map((mode, index) => (
            <motion.a
              key={index}
              href={mode.link}
              className="group relative flex flex-col items-center justify-center h-64 rounded-xl overflow-hidden border-2 border-slate-700 hover:border-gaming-accent transition-all duration-300 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Card Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${mode.image})` }}
              />
              
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-70 transition-opacity" />
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center justify-end h-full pb-6 px-4 text-center w-full">
                <h2 className="text-3xl font-bold text-white mb-2 group-hover:text-gaming-accent transition-colors">
                  {mode.title}
                </h2>
                <p className="text-sm text-gray-300 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  {mode.description}
                </p>
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
