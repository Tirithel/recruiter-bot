import { typescript } from "projen";
const project = new typescript.TypeScriptAppProject({
  defaultReleaseBranch: "main",
  name: "recruiter-bot",
  renovatebot: true,
  dependabot: true,
  projenrcTs: true,
  prettier: true,
  prettierOptions: {
    overrides: [{ files: "*", options: { printWidth: 100 } }],
  },
  eslint: false,
  gitignore: [".env"],
  deps: ["discord.js@14", "dotenv", "aws-sdk", "es2020"],
  devDeps: ["ts-mockito"],
  /* The description is just a string that helps people understand the purpose of the package. */
  description: "recruitment bot for managing guild applications",
  /* The "name" in package.json. */
  packageName: "recruiter-bot",
  entrypoint: "src/index.ts",
  tsconfig: { compilerOptions: { target: "es2020", lib: ["es2020"] } },
});
project.synth();
