import { ChefHat } from 'lucide-react';

export const Logo = () => (
  <div className="flex items-center justify-center sm:justify-start gap-2">
    <ChefHat className="h-8 w-8 text-primary" />
    <span className="text-2xl font-bold font-headline text-foreground">
      AI Recipe Assistant
    </span>
  </div>
);
