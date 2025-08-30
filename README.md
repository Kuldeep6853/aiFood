# AI Recipe Assistant

This is a [Next.js](https://nextjs.org/) project that helps you find recipe ideas based on the ingredients you have. It uses AI to generate suggestions.

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

You'll need [Node.js](https://nodejs.org/) (version 18 or later) and npm installed on your computer.

### 1. Install Dependencies

First, navigate to your project's root directory and install the necessary packages using npm:

```bash
npm install
```

### 2. Set Up Environment Variables

This project uses the Google Gemini API to generate recipe suggestions. To use it, you'll need an API key.

1.  Create an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  In the root of your project, create a new file named `.env`.
3.  Add your API key to the `.env` file like this:

```
GEMINI_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with the actual key you obtained.

### 3. Run the Development Servers

This project requires two processes to be running simultaneously:

1.  **The Next.js web application:** This serves the user interface.
2.  **The Genkit server:** This handles the communication with the AI model.

You'll need to open two separate terminal windows or tabs to run them.

**In your first terminal, run the Next.js app:**

```bash
npm run dev
```

This will start the web server, usually on [http://localhost:9002](http://localhost:9002).

**In your second terminal, run the Genkit server:**

```bash
npm run genkit:watch
```

This starts the Genkit process that makes your AI flows available to the application. Using `genkit:watch` will automatically restart the server when you make changes to your AI flows.

Once both are running, you can open your browser to [http://localhost:9002](http://localhost:9002) to see the application in action!

## Project Structure

Here's an overview of the key files and directories in the project:

```
/
|-- src/
|   |-- app/
|   |   |-- page.tsx (Main page)
|   |   |-- layout.tsx (Root layout)
|   |   |-- globals.css (Global styles)
|   |   `-- actions.ts (Server actions)
|   |-- ai/
|   |   |-- genkit.ts (Genkit AI configuration)
|   |   |-- dev.ts (Genkit development server entry)
|   |   `-- flows/
|   |       `-- generate-recipe-suggestions.ts (AI flow for recipe suggestions)
|   |-- components/
|   |   |-- ui/ (ShadCN UI components)
|   |   |-- recipe-generator.tsx (The main form component)
|   |   |-- recipe-card.tsx (Component to display a single recipe)
|   |   `-- icons.tsx (Custom icon components)
|   |-- lib/
|   |   |-- utils.ts (Utility functions)
|   |   `-- types.ts (TypeScript types and schemas)
|   `-- hooks/
|       |-- use-toast.ts (Toast hook)
|       `-- use-mobile.ts (Hook to detect mobile devices)
|-- public/ (Static assets)
|-- package.json (Project dependencies and scripts)
|-- next.config.ts (Next.js configuration)
|-- tailwind.config.ts (Tailwind CSS configuration)
`-- tsconfig.json (TypeScript configuration)
```
