'use client';

import Link from 'next/link';
import Image from 'next/image';
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
    <main className="relative min-h-screen bg-slate-950 font-custom overflow-hidden flex flex-col items-center justify-center">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0 opacity-30">
        <Image
          src="/images/tacticians.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/80 to-blue-950/90 z-0" />

      <div className="relative z-10 flex flex-col items-center w-full max-w-6xl px-4 py-12">
        <Link href="/">
          <motion.h1 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileHover={{ scale: 1.1, rotate: [0, -2, 2, 0] }}
            transition={{ duration: 0.8, type: "spring" }}
            className="text-7xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-blue-400 to-purple-400 drop-shadow-lg cursor-pointer"
          >
            TFTdle
          </motion.h1>
        </Link>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-center mb-12 max-w-2xl text-blue-100 drop-shadow-md"
        >
          Choose a game mode and test your knowledge of Teamfight Tactics!
        </motion.p>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap justify-center gap-8"
        >
          {gameModes.map((mode, index) => (
            <Link key={index} href={mode.link} className="group">
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex flex-col items-center justify-end h-64 w-72 rounded-2xl overflow-hidden shadow-2xl border border-blue-500/30 bg-slate-900/50 backdrop-blur-sm group-hover:border-yellow-400/50 transition-colors duration-300"
              >
                {/* Image Background for Card */}
                <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110 opacity-60 group-hover:opacity-80">
                  <Image
                    src={mode.image}
                    alt={mode.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

                {/* Content */}
                <div className="relative z-10 p-6 w-full flex flex-col items-center text-center">
                  <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors drop-shadow-md">
                    {mode.title}
                  </h2>
                  <p className="text-sm text-gray-300 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    {mode.description}
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
