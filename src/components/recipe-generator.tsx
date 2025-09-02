'use client';

import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ChefHat, CookingPot, Leaf, Sparkles, Search, UtensilsCrossed, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getRecipeSuggestionsAction, getRecipeByNameAction } from '@/app/actions';
import { recipeFormSchema, reverseRecipeFormSchema } from '@/lib/schemas';
import type { RecipeFormValues, ReverseRecipeFormValues } from '@/lib/types';
import type { GenerateRecipeSuggestionsOutput } from '@/lib/schemas';
import { RecipeCard } from './recipe-card';
import { Skeleton } from './ui/skeleton';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


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
  
  const ingredientForm = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      ingredients: '',
      dietaryRestrictions: 'None',
      numberOfPeople: 2,
    },
  });

  const dishForm = useForm<ReverseRecipeFormValues>({
    resolver: zodResolver(reverseRecipeFormSchema),
    defaultValues: {
      dishName: '',
      numberOfPeople: 2,
    },
  });

  const onIngredientSubmit = (values: RecipeFormValues) => {
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

  const onDishSubmit = (values: ReverseRecipeFormValues) => {
    setRecipes([]);
    startTransition(async () => {
      const result = await getRecipeByNameAction(values);
      if (result.success) {
        setRecipes([result.data]); // Wrap single recipe in an array
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
        <CardContent className="p-0">
          <Tabs defaultValue="ingredients" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-16 rounded-b-none">
              <TabsTrigger value="ingredients" className="h-full text-sm md:text-base gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <CookingPot className="h-6 w-6 hidden md:inline" /> By Ingredient
              </TabsTrigger>
              <TabsTrigger value="dish" className="h-full text-sm md:text-base gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <UtensilsCrossed className="h-6 w-6 hidden md:inline" /> By Dish
              </TabsTrigger>
            </TabsList>
            <TabsContent value="ingredients" className="p-6 md:p-8">
              <Form {...ingredientForm}>
              <form onSubmit={ingredientForm.handleSubmit(onIngredientSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                        control={ingredientForm.control}
                        name="ingredients"
                        render={({ field }) => (
                        <FormItem className="md:col-span-2">
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
                        control={ingredientForm.control}
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
                     <FormField
                        control={ingredientForm.control}
                        name="numberOfPeople"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xl font-semibold flex items-center gap-2">
                                <Users className="h-6 w-6 text-primary"/>
                                Number of People
                            </FormLabel>
                            <FormControl>
                            <Input
                                type="number"
                                min="1"
                                placeholder="e.g., 2"
                                className="text-base h-12"
                                {...field}
                                onChange={event => field.onChange(+event.target.value)}
                            />
                            </FormControl>
                            <FormDescription>
                                How many people will you be cooking for?
                            </FormDescription>
                            <FormMessage />
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
            </TabsContent>
            <TabsContent value="dish" className="p-6 md:p-8">
              <Form {...dishForm}>
                <form onSubmit={dishForm.handleSubmit(onDishSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                        control={dishForm.control}
                        name="dishName"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xl font-semibold flex items-center gap-2">
                                <Search className="h-6 w-6 text-primary"/>
                                Dish Name
                            </FormLabel>
                            <FormControl>
                            <Input
                                placeholder="e.g., Chicken Alfredo, Gajar Ka Halwa"
                                className="text-base h-12"
                                {...field}
                            />
                            </FormControl>
                            <FormDescription>
                                Enter the name of the dish you'd like a recipe for.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={dishForm.control}
                        name="numberOfPeople"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xl font-semibold flex items-center gap-2">
                                <Users className="h-6 w-6 text-primary"/>
                                Number of People
                            </FormLabel>
                            <FormControl>
                            <Input
                                type="number"
                                min="1"
                                placeholder="e.g., 2"
                                className="text-base h-12"
                                {...field}
                                onChange={event => field.onChange(+event.target.value)}
                            />
                            </FormControl>
                            <FormDescription>
                                How many people will you be cooking for?
                            </FormDescription>
                            <FormMessage />
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
                        Finding recipe...
                        </>
                    ) : (
                        <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Get Recipe
                        </>
                    )}
                    </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {isPending && (
         <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center font-headline animate-pulse">Checking the pantry...</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
            </div>
         </div>
      )}

      {recipes.length > 0 && (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {recipes.map((recipe, index) => (
                <RecipeCard key={index} recipe={recipe} />
            ))}
            </div>
        </div>
      )}
    </div>
  );
}
