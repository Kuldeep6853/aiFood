'use server';

/**
 * @fileOverview AI-powered recipe suggestion flow.
 *
 * - generateRecipeSuggestions - A function that suggests recipes based on ingredients.
 * - GenerateRecipeSuggestionsInput - The input type for the generateRecipeSuggestions function.
 * - GenerateRecipeSuggestionsOutput - The return type for the generateRecipeSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecipeSuggestionsInputSchema = z.object({
  ingredients: z
    .string()
    .describe('A comma-separated list of ingredients the user has available.'),
  dietaryRestrictions: z
    .string()
    .optional()
    .describe('Dietary restrictions such as vegetarian, vegan, or gluten-free.'),
});
export type GenerateRecipeSuggestionsInput = z.infer<
  typeof GenerateRecipeSuggestionsInputSchema
>;

const GenerateRecipeSuggestionsOutputSchema = z.object({
  recipes: z
    .array(
      z.object({
        name: z.string().describe('The name of the recipe.'),
        ingredients: z.string().describe('The ingredients required for the recipe.'),
        instructions: z.string().describe('Step-by-step cooking instructions.'),
        nutritionalInformation: z
          .string()
          .describe('Nutritional information (calories, fat, protein, carbs).'),
      })
    )
    .describe('An array of recipe suggestions.'),
});
export type GenerateRecipeSuggestionsOutput = z.infer<
  typeof GenerateRecipeSuggestionsOutputSchema
>;

export async function generateRecipeSuggestions(
  input: GenerateRecipeSuggestionsInput
): Promise<GenerateRecipeSuggestionsOutput> {
  return generateRecipeSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipeSuggestionsPrompt',
  input: {schema: GenerateRecipeSuggestionsInputSchema},
  output: {schema: GenerateRecipeSuggestionsOutputSchema},
  prompt: `You are a recipe suggestion AI. Given the ingredients a user has available, you will suggest recipes they can make.

Ingredients: {{{ingredients}}}

{{#if dietaryRestrictions}}
Dietary Restrictions: {{{dietaryRestrictions}}}
{{/if}}

Suggest 3 recipes, providing the recipe name, ingredients, step-by-step cooking instructions, and nutritional information for each recipe.
Ensure that the recipes adhere to any dietary restrictions specified.
Output in JSON format.`,
});

const generateRecipeSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateRecipeSuggestionsFlow',
    inputSchema: GenerateRecipeSuggestionsInputSchema,
    outputSchema: GenerateRecipeSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
