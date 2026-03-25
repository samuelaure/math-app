import { motion } from 'framer-motion';

export default function GardenView({ seeds }) {
  const items = Array.from({ length: Math.min(seeds, 50) });

  return (
    <div className="garden-grid">
      {items.map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 10, delay: Math.random() * 0.5 }}
          className="garden-plant"
        >
          🌱
        </motion.div>
      ))}
      {seeds > 50 && (
        <div className="garden-overflow">+{seeds - 50} más!</div>
      )}
      {seeds === 0 && (
        <div className="empty-garden">El jardín espera por tus primeras semillas...</div>
      )}
    </div>
  );
}
