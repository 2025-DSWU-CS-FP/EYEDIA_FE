import { motion } from 'framer-motion';

interface ProgressBarProps {
  step: number;
  total: number;
}

export default function ProgressBar({ step, total }: ProgressBarProps) {
  const percentage = ((step + 1) / total) * 100;

  return (
    <div className="mb-[4rem] h-[0.4rem] w-full overflow-hidden rounded-[10px] bg-gray-10">
      <motion.div
        className="h-full bg-brand-blue"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />
    </div>
  );
}
