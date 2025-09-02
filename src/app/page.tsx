import { RecipeGenerator } from '@/components/recipe-generator';
import { Logo } from '@/components/icons';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="max-w-3xl mx-auto space-y-6 text-center">
          <Logo />
          <h1 className="text-4xl font-extrabold tracking-tight font-headline sm:text-5xl lg:text-6xl text-primary">
            Turn Your Pantry into a Masterpiece
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stuck on what to make? Just list the ingredients you have, and our AI chef will instantly craft delicious recipe ideas for you. It's that simple!
          </p>
        </div>

        <div className="max-w-4xl mx-auto mt-10 lg:mt-12">
          <RecipeGenerator />
        </div>
      </div>
    </main>
  );
}
