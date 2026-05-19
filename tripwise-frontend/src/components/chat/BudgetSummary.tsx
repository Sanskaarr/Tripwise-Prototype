import React, { useMemo } from 'react';
import { IndianRupee, PieChart, ShoppingBag, Utensils, Car, Home } from 'lucide-react';

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface BudgetSummaryProps {
  messages: Message[];
}

interface BudgetCategory {
  name: string;
  amount: number;
  icon: React.ReactNode;
  color: string;
}

export const BudgetSummary: React.FC<BudgetSummaryProps> = ({ messages }) => {
  const budgetData = useMemo(() => {
    // Combine all assistant content to look for budget tables
    const text = messages
      .filter(m => m.role === 'assistant')
      .map(m => m.content)
      .join('\n');

    // Extract table rows using regex
    // | Category | Cost |
    // | Accommodation | ₹X |
    const rowRegex = /\|\s*(.*?)\s*\|\s*[₹$]([\d,]+)\s*\|/g;
    const categories: BudgetCategory[] = [];
    let match;

    const iconMap: Record<string, any> = {
      'accommodation': <Home className="w-4 h-4" />,
      'food': <Utensils className="w-4 h-4" />,
      'transport': <Car className="w-4 h-4" />,
      'attractions': <PieChart className="w-4 h-4" />,
      'shopping': <ShoppingBag className="w-4 h-4" />,
    };

    const colorMap: Record<string, string> = {
      'accommodation': 'text-blue-400',
      'food': 'text-orange-400',
      'transport': 'text-green-400',
      'attractions': 'text-purple-400',
      'shopping': 'text-pink-400',
    };

    while ((match = rowRegex.exec(text)) !== null) {
      const name = match[1].trim();
      const amount = parseInt(match[2].replace(/,/g, ''));

      if (name.toLowerCase() === 'total' || isNaN(amount)) continue;

      categories.push({
        name,
        amount,
        icon: iconMap[name.toLowerCase()] || <IndianRupee className="w-4 h-4" />,
        color: colorMap[name.toLowerCase()] || 'text-primary',
      });
    }

    const total = categories.reduce((sum, cat) => sum + cat.amount, 0);

    return { categories, total };
  }, [messages]);

  if (budgetData.categories.length === 0) {
    return (
      <div className="glass-card p-6 rounded-2xl border-white/10 bg-white/5 flex flex-col items-center justify-center text-center">
        <IndianRupee className="w-8 h-8 text-muted-foreground/30 mb-2" />
        <p className="text-sm text-muted-foreground">No budget details found in the conversation yet.</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-2xl border-white/10 bg-white/5 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-lg flex items-center gap-2">
          <PieChart className="w-5 h-5 text-primary" />
          Budget Estimate
        </h3>
        <div className="text-2xl font-bold text-primary">
          ₹{budgetData.total.toLocaleString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgetData.categories.map((cat, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
            <div className={`p-2 rounded-lg bg-black/20 ${cat.color}`}>
              {cat.icon}
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{cat.name}</p>
              <p className="text-sm font-semibold">₹{cat.amount.toLocaleString()}</p>
            </div>
            <div className="w-12 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary" 
                style={{ width: `${(cat.amount / budgetData.total) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
