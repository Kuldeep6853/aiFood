import { z } from 'zod';

export const recipeFormSchema = z.object({
  ingredients: z.string().min(3, {
    message: "Please enter at least one ingredient.",
  }),
  dietaryRestrictions: z.string().optional(),
});

export type RecipeFormValues = z.infer<typeof recipeFormSchema>;
