import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContinueButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
}

const ContinueButton = ({ 
  onClick, 
  disabled = false, 
  loading = false,
  children = 'Continue'
}: ContinueButtonProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Button
        variant="continue"
        onClick={onClick}
        disabled={disabled || loading}
        className="group"
      >
        {loading ? (
          <motion.span
            className="flex items-center gap-2"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Saving...
          </motion.span>
        ) : (
          <>
            {children}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </>
        )}
      </Button>
    </motion.div>
  );
};

export default ContinueButton;
