import { z } from 'zod';

// Schema for the "Search by Ingredients" form
export const recipeFormSchema = z.object({
  ingredients: z.string().min(3, {
    message: "Please enter at least three characters.",
  }),
  dietaryRestrictions: z.string().optional(),
  numberOfPeople: z.number().min(1, {
    message: "Please enter a number of people greater than 0.",
  }).optional(),
});

// Schema for the "Search by Dish Name" form
export const reverseRecipeFormSchema = z.object({
  dishName: z.string().min(3, {
    message: "Please enter at least three characters.",
  }),
  numberOfPeople: z.number().min(1, {
    message: "Please enter a number of people greater than 0.",
  }).optional(),
});

const recipeSchema = z.object({
  name: z.string().describe('The name of the recipe.'),
  ingredients: z.string().describe('The ingredients required for the recipe.'),
  instructions: z.string().describe('Step-by-step cooking instructions.'),
  nutritionalInformation: z
    .string()
    .describe('Nutritional information (calories, fat, protein, carbs).'),
  imagePrompt: z
    .string()
    .describe(
      'A descriptive prompt for an image generation model to create a photo of the finished dish.'
    ),
});


// Input schema for the recipe suggestions flow
export const GenerateRecipeSuggestionsInputSchema = z.object({
    ingredients: z
      .string()
      .describe('A comma-separated list of ingredients the user has available.'),
    dietaryRestrictions: z
      .string()
      .optional()
      .describe('Dietary restrictions such as vegetarian, vegan, or gluten-free.'),
    numberOfPeople: z
        .number()
        .optional()
        .describe('The number of people the recipe should serve.'),
  });
export type GenerateRecipeSuggestionsInput = z.infer<
    typeof GenerateRecipeSuggestionsInputSchema
>;

// Output schema for the recipe suggestions flow
export const GenerateRecipeSuggestionsOutputSchema = z.object({
    recipes: z
      .array(recipeSchema)
      .describe('An array of recipe suggestions.'),
  });
export type GenerateRecipeSuggestionsOutput = z.infer<
    typeof GenerateRecipeSuggestionsOutputSchema
>;

// Input schema for the recipe-by-name flow
export const GenerateRecipeFromNameInputSchema = z.object({
    dishName: z
      .string()
      .describe('The name of the dish the user wants a recipe for.'),
    numberOfPeople: z
        .number()
        .optional()
        .describe('The number of people the recipe should serve.'),
  });
export type GenerateRecipeFromNameInput = z.infer<
    typeof GenerateRecipeFromNameInputSchema
>;

// Output schema for the recipe-by-name flow
export const GenerateRecipeFromNameOutputSchema = recipeSchema;
export type GenerateRecipeFromNameOutput = z.infer<typeof GenerateRecipeFromNameOutputSchema>;
