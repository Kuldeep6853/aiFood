import { z } from 'zod';
import { recipeFormSchema, reverseRecipeFormSchema } from './schemas';

export type RecipeFormValues = z.infer<typeof recipeFormPojso>;


export type ReverseRecipeFormValues = z.infer<typeof reverseRecipeFormSchema>;
