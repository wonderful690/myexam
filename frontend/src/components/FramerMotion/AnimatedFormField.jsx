import { motion } from 'framer-motion';

const fieldVariants = {
  hidden: {
    opacity: 0,
    y: 15,
  },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 + i * 0.08,
      duration: 0.3,
      ease: 'easeOut',
    },
  }),
};

export default function AnimatedFormField({ children, index = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      variants={fieldVariants}
      custom={index}
    >
      {children}
    </motion.div>
  );
}