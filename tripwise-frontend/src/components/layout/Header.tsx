import { motion } from 'framer-motion';
import { Plane, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  variant?: 'transparent' | 'solid';
}

const Header = ({ variant = 'transparent' }: HeaderProps) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-5 ${
        variant === 'solid' ? 'bg-background/80 backdrop-blur-xl border-b border-border' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.a
          href="/"
          className="flex items-center gap-3 text-foreground"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <Plane className="w-6 h-6 rotate-[-30deg]" strokeWidth={1.5} />
          <span className="text-xl font-display font-medium tracking-wide">TripWise</span>
        </motion.a>

        {/* Menu Button */}
        <Button
          variant="heroOutline"
          size="sm"
          className="px-5 py-2 h-auto rounded-full border border-foreground/20"
        >
          <span className="text-xs tracking-widest mr-2">MENU</span>
          <Menu className="w-4 h-4" strokeWidth={1.5} />
        </Button>
      </div>
    </motion.header>
  );
};

export default Header;
