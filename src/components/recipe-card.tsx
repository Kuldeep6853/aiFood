import { Apple, Beef, Flame } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import type { GenerateRecipeSuggestionsOutput } from '@/ai/flows/generate-recipe-suggestions';
import { Badge } from '@/components/ui/badge';

type Recipe = GenerateRecipeSuggestionsOutput['recipes'][0];

function formatList(text: string) {
    if (!text) return null;
    return text.split(/,\s*|\n/).map((item, index) => (
        <li key={index} className="ml-4 list-disc">{item.trim()}</li>
    ));
}

function formatInstructions(text: string) {
    if (!text) return null;
    const steps = text.split(/\n\s*\d+\.\s*/).filter(Boolean);
    if (steps.length <= 1 && text.includes('\n')) {
      return text.split('\n').filter(Boolean).map((step, index) => (
        <li key={index} className="mb-2 flex gap-2">
            <div className="flex-shrink-0 font-bold">{index + 1}.</div>
            <div>{step.trim()}</div>
        </li>
      ));
    }
    return steps.map((step, index) => (
        <li key={index} className="mb-2 flex gap-2">
            <div className="flex-shrink-0 font-bold">{index + 1}.</div>
            <div>{step.trim()}</div>
        </li>
    ));
}

function formatNutritionalInfo(text: string) {
    if (!text) return null;
    return text.split(',').map((info, index) => (
        <Badge key={index} variant="secondary" className="whitespace-nowrap">{info.trim()}</Badge>
    ));
}

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">{recipe.name}</CardTitle>
        <CardDescription>A delicious meal idea based on your ingredients.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <Accordion type="single" collapsible className="w-full" defaultValue="ingredients">
            <AccordionItem value="ingredients">
                <AccordionTrigger className="text-lg font-semibold">
                    <div className="flex items-center gap-2">
                        <Apple className="h-5 w-5"/> Ingredients
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <ul className="pt-2 space-y-1">
                        {formatList(recipe.ingredients)}
                    </ul>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="instructions">
                <AccordionTrigger className="text-lg font-semibold">
                    <div className="flex items-center gap-2">
                        <Flame className="h-5 w-5"/> Instructions
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <ol className="pt-2 space-y-2">
                        {formatInstructions(recipe.instructions)}
                    </ol>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter>
        <div className="w-full space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
                <Beef className="h-5 w-5" />
                Nutritional Info
            </h4>
            <div className="flex flex-wrap gap-2">
                {formatNutritionalInfo(recipe.nutritionalInformation)}
            </div>
        </div>
      </CardFooter>
    </Card>
  );
}
