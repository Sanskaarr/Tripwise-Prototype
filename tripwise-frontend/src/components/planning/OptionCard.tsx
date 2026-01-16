import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OptionCardProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const OptionCard = ({ 
  title, 
  description, 
  icon, 
  selected = false, 
  onClick,
  className,
  children 
}: OptionCardProps) => {
  // If children are provided, render flexible layout
  if (children) {
    return (
      <motion.button
        onClick={onClick}
        className={cn(
          'option-card relative w-full group',
          selected && 'selected',
          className
        )}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.2 }}
      >
        {children}
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-3 right-3 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary flex items-center justify-center"
          >
            <Check className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" strokeWidth={2.5} />
          </motion.div>
        )}
      </motion.button>
    );
  }

  // Original layout with title/description/icon
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'option-card relative w-full text-left group',
        selected && 'selected',
        className
      )}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {icon && (
          <div className={cn(
            'p-2 sm:p-3 rounded-xl bg-muted transition-colors duration-300 flex-shrink-0',
            selected && 'bg-primary/10'
          )}>
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className={cn(
            'font-display text-base sm:text-lg font-medium transition-colors duration-300',
            selected && 'text-primary'
          )}>
            {title}
          </h4>
          {description && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary flex items-center justify-center"
          >
            <Check className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" strokeWidth={2.5} />
          </motion.div>
        )}
      </div>
    </motion.button>
  );
};

export default OptionCard;
