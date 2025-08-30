import { RecipeGenerator } from '@/components/recipe-generator';
import { Logo } from '@/components/icons';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
      <div className="max-w-3xl mx-auto space-y-8 text-center">
        <Logo />
        <h1 className="text-4xl font-extrabold tracking-tight font-headline lg:text-5xl">
          Turn Your Pantry into a Feast
        </h1>
        <p className="text-lg text-muted-foreground">
          Don't know what to cook? Enter the ingredients you have, and our AI chef will whip up delicious recipe suggestions for you in seconds.
        </p>
      </div>

      <div className="max-w-4xl mx-auto mt-16">
        <RecipeGenerator />
      </div>
    </main>
  );
}
