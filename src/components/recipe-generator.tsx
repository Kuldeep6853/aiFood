'use client';

import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ChefHat, CookingPot, Leaf, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getRecipeSuggestionsAction } from '@/app/actions';
import { recipeFormSchema, RecipeFormValues } from '@/lib/types';
import type { GenerateRecipeSuggestionsOutput } from '@/ai/flows/generate-recipe-suggestions';
import { RecipeCard } from './recipe-card';
import { Skeleton } from './ui/skeleton';
import { Card, CardContent } from './ui/card';

const dietaryOptions = [
  "None",
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Nut-Free",
  "Pescatarian"
];

const SkeletonCard = () => (
    <Card className="flex flex-col">
        <Skeleton className="w-full h-48" />
        <CardContent className="p-6 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
        </CardContent>
    </Card>
)

export function RecipeGenerator() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [recipes, setRecipes] = useState<GenerateRecipeSuggestionsOutput['recipes']>([]);
  
  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      ingredients: '',
      dietaryRestrictions: 'None',
    },
  });

  const onSubmit = (values: RecipeFormValues) => {
    setRecipes([]);
    startTransition(async () => {
      const result = await getRecipeSuggestionsAction(values);
      if (result.success) {
        setRecipes(result.data.recipes);
      } else {
        toast({
          variant: "destructive",
          title: "An error occurred",
          description: result.error,
        });
      }
    });
  };

  return (
    <div className="space-y-16">
      <Card className="overflow-hidden shadow-lg border-2 border-primary/20">
        <CardContent className="p-6 md:p-8">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                    control={form.control}
                    name="ingredients"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-xl font-semibold flex items-center gap-2">
                        <CookingPot className="h-6 w-6 text-primary"/>
                        Available Ingredients
                        </FormLabel>
                        <FormControl>
                        <Textarea
                            placeholder="e.g., chicken breast, broccoli, garlic, olive oil"
                            className="resize-none h-36 text-base"
                            {...field}
                        />
                        </FormControl>
                        <FormDescription>
                        Enter a comma-separated list of ingredients you have on hand.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="dietaryRestrictions"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-xl font-semibold flex items-center gap-2">
                        <Leaf className="h-6 w-6 text-primary"/>
                        Dietary Preferences
                        </FormLabel>
                        <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        >
                        <FormControl>
                            <SelectTrigger className="text-base">
                            <SelectValue placeholder="Any special dietary needs?" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {dietaryOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                                {option}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        <FormDescription>
                        Let us know if you have any dietary restrictions.
                        </FormDescription>
                    </FormItem>
                    )}
                />
                </div>

                <Button type="submit" disabled={isPending} className="w-full md:w-auto transform transition-transform duration-200 hover:scale-105" size="lg">
                {isPending ? (
                    <>
                    <span className="animate-spin mr-2">
                        <ChefHat className="h-5 w-5" />
                    </span>
                    Whipping up ideas...
                    </>
                ) : (
                    <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Recipes
                    </>
                )}
                </Button>
            </form>
            </Form>
        </CardContent>
      </Card>

      {isPending && (
         <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center font-headline animate-pulse">Checking the pantry...</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
            </div>
         </div>
      )}

      {recipes.length > 0 && (
        <div className="space-y-8">
            <h2 className="text-4xl font-bold text-center font-headline">Bon Appétit!</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {recipes.map((recipe, index) => (
                <RecipeCard key={index} recipe={recipe} />
            ))}
            </div>
        </div>
      )}
    </div>
  );
}
