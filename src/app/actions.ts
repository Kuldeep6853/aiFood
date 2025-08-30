'use server';

import {
  generateRecipeSuggestions,
  GenerateRecipeSuggestionsInput,
  GenerateRecipeSuggestionsOutput
} from '@/ai/flows/generate-recipe-suggestions';
import { recipeFormSchema } from '@/lib/types';

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
