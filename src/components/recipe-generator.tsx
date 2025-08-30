'use client';

import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ChefHat, CookingPot, Leaf } from 'lucide-react';

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

const dietaryOptions = [
  "None",
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Nut-Free",
  "Pescatarian"
];

export function RecipeGenerator() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [recipes, setRecipes] = useState<GenerateRecipeSuggestionsOutput['recipes']>([]);
  
  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      ingredients: '',
      dietaryRestrictions: '',
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
    <div className="space-y-12">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-card p-6 md:p-8 rounded-lg shadow-sm border">
          <div className="space-y-8">
            <FormField
              control={form.control}
              name="ingredients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold flex items-center gap-2">
                    <CookingPot className="h-5 w-5"/>
                    What ingredients do you have?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., chicken breast, broccoli, garlic, olive oil"
                      className="resize-none h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter a comma-separated list of ingredients.
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
                  <FormLabel className="font-semibold flex items-center gap-2">
                    <Leaf className="h-5 w-5"/>
                    Dietary Restrictions
                  </FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(value === 'None' ? '' : value)} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a dietary preference" />
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
                    Optional: filter by dietary needs.
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={isPending} className="w-full md:w-auto" size="lg">
            {isPending ? (
              <>
                <span className="animate-spin mr-2">
                  <ChefHat className="h-5 w-5" />
                </span>
                Generating Recipes...
              </>
            ) : (
              <>
                <ChefHat className="mr-2 h-5 w-5" />
                Find Recipes
              </>
            )}
          </Button>
        </form>
      </Form>

      {isPending && (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Skeleton className="h-[400px] rounded-lg" />
            <Skeleton className="h-[400px] rounded-lg" />
            <Skeleton className="h-[400px] rounded-lg" />
         </div>
      )}

      {recipes.length > 0 && (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center">Your Recipe Suggestions</h2>
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
