import { motion } from 'framer-motion';

const itemVariants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.35,
      ease: 'easeOut',
    },
  }),
};

export default function AnimatedListItem({ children, index = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      variants={itemVariants}
      custom={index}
    >
      {children}
    </motion.div>
  );
}