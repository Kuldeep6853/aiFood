'use server';

/**
 * @fileOverview AI-powered recipe suggestion flow.
 *
 * - generateRecipeSuggestions - A function that suggests recipes based on ingredients.
 */

import {ai} from '@/ai/genkit';
import {
    GenerateRecipeSuggestionsInput,
    GenerateRecipeSuggestionsInputSchema,
    GenerateRecipeSuggestionsOutput,
    GenerateRecipeSuggestionsOutputSchema,
} from '@/lib/schemas';


export async function generateRecipeSuggestions(
  input: GenerateRecipeSuggestionsInput
): Promise<GenerateRecipeSuggestionsOutput> {
  return generateRecipeSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipeSuggestionsPrompt',
  input: {schema: GenerateRecipeSuggestionsInputSchema},
  output: {schema: GenerateRecipeSuggestionsOutputSchema},
  prompt: `You are a recipe suggestion AI. Your language should be simple and easy to understand for a general audience; avoid jargon or overly technical cooking terms.

Given the ingredients a user has available, you will suggest recipes they can make.

Ingredients provided by user: {{{ingredients}}}

{{#if dietaryRestrictions}}
Dietary Restrictions: {{{dietaryRestrictions}}}
{{/if}}

{{#if numberOfPeople}}
Adjust the ingredient quantities for each recipe to serve {{{numberOfPeople}}} people.
{{/if}}


Suggest 3 recipes. For each recipe:
1.  List all ingredients required, scaled for the specified number of people if provided.
2.  If any required ingredient is NOT in the user's provided list, suggest a smart and common alternative (e.g., "Butter (or olive oil)").
3.  Provide simple, step-by-step cooking instructions.
4.  Provide nutritional information.
5.  Provide a short, descriptive prompt for generating a photorealistic image of the finished dish.
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
