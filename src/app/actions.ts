'use server';

import {
  generateRecipeSuggestions
} from '@/ai/flows/generate-recipe-suggestions';
import {
  generateRecipeFromName
} from '@/ai/flows/generate-recipe-from-name';
import { recipeFormSchema, reverseRecipeFormSchema, GenerateRecipeSuggestionsInput, GenerateRecipeSuggestionsOutput, GenerateRecipeFromNameInput, GenerateRecipeFromNameOutput } from '@/lib/schemas';

export async function getRecipeSuggestionsAction(
  values: GenerateRecipeSuggestionsInput
): Promise<{ success: true; data: GenerateRecipeSuggestionsOutput } | { success: false; error: string }> {
  const validatedFields = recipeFormSchema.safeParse(values);

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.flatten().fieldErrors;
    const firstError = Object.values(errorMessages).flat()[0] || 'Invalid input.';
    return {
      success: false,
      error: firstError,
    };
  }

  try {
    const output = await generateRecipeSuggestions(validatedFields.data);
    if (!output.recipes || output.recipes.length === 0) {
      return { success: false, error: 'Could not find any recipes with those ingredients. Try adding more!' };
    }
    return { success: true, data: output };
  } catch (error) {
    console.error("Error generating recipe suggestions:", error);
    return { success: false, error: 'Failed to generate recipes. The AI may be busy, please try again.' };
  }
}


export async function getRecipeByNameAction(
  values: GenerateRecipeFromNameInput
): Promise<{ success: true; data: GenerateRecipeFromNameOutput } | { success: false; error: string }> {
  const validatedFields = reverseRecipeFormSchema.safeParse(values);

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.flatten().fieldErrors;
    const firstError = Object.values(errorMessages).flat()[0] || 'Invalid input.';
    return {
      success: false,
      error: firstError,
    };
  }

  try {
    const output = await generateRecipeFromName(validatedFields.data);
    if (!output) {
      return { success: false, error: 'Could not find a recipe for that dish. Please try another name.' };
    }
    return { success: true, data: output };
  } catch (error) {
    console.error("Error generating recipe from name:", error);
    return { success: false, error: 'Failed to generate the recipe. The AI may be busy, please try again.' };
  }
}
