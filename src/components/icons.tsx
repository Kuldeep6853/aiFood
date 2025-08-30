import { ChefHat } from 'lucide-react';

export const Logo = () => (
  <div className="flex items-center justify-center gap-3 bg-primary text-primary-foreground rounded-full px-4 py-2 w-fit mx-auto">
    <ChefHat className="h-7 w-7" />
    <span className="text-2xl font-bold font-headline">
      Recipe<span className="font-light">AI</span>
    </span>
  </div>
);
