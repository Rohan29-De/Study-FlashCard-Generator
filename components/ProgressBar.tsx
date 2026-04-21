import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number; // 0 to 100
  label?: string;
  color?: string;
}

export function ProgressBar({ value, label, color = 'bg-blue-500' }: ProgressBarProps) {
  return (
    <div className="w-full">
      {(label || true) && (
        <div className="flex justify-between text-xs font-medium text-slate-500 mb-2">
          <span>{label}</span>
          <span>{Math.round(value)}%</span>
        </div>
      )}
      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
}
