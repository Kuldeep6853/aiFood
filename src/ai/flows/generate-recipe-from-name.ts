'use server';

/**
 * @fileOverview AI-powered recipe generation from a dish name.
 *
 * - generateRecipeFromName - A function that generates a recipe for a given dish name.
 */

import {ai} from '@/ai/genkit';
import {
    GenerateRecipeFromNameInput,
    GenerateRecipeFromNameInputSchema,
    GenerateRecipeFromNameOutput,
    GenerateRecipeFromNameOutputSchema,
} from '@/lib/schemas';


export async function generateRecipeFromName(
  input: GenerateRecipeFromNameInput
): Promise<GenerateRecipeFromNameOutput> {
  return generateRecipeFromNameFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipeFromNamePrompt',
  input: {schema: GenerateRecipeFromNameInputSchema},
  output: {schema: GenerateRecipeFromNameOutputSchema},
  prompt: `You are a recipe suggestion AI. Your language should be simple and easy to understand for a general audience; avoid jargon or overly technical cooking terms.

Given a dish name, you will provide a recipe for it.

Dish name provided by user: {{{dishName}}}

For the recipe:
1.  Provide the name of the recipe, which should be the same as the dish name provided by the user.
2.  List all required ingredients with quantities.
3.  Provide simple, step-by-step cooking instructions.
4.  Provide nutritional information (calories, fat, protein, carbs).
5.  Provide a short, descriptive prompt for generating a photorealistic image of the finished dish.
Output in JSON format.`,
});

const generateRecipeFromNameFlow = ai.defineFlow(
  {
    name: 'generateRecipeFromNameFlow',
    inputSchema: GenerateRecipeFromNameInputSchema,
    outputSchema: GenerateRecipeFromNameOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
