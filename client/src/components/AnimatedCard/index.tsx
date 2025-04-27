import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface AnimatedCardProps {
  title: string;
  description: string;
  icon: string;
  delay?: number;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({ title, description, icon, delay = 0 }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  React.useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, delay }
        },
        hidden: { opacity: 0, y: 50 }
      }}
      className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4"
      >
        <span className="text-2xl">{icon}</span>
      </motion.div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}; 