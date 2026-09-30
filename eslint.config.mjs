import base from "@ptt/config/eslint/base";
import next from "@ptt/config/eslint/next";

/** ESLint (flat config) para todo el monorepo. */
const eslintConfig = [
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/coverage/**",
      "**/next-env.d.ts",
    ],
  },
  ...base,
  // Reglas de Next.js solo para la app web.
  ...next.map((config) => ({
    ...config,
    files: ["apps/web/**/*.{js,jsx,mjs,ts,tsx}"],
  })),
  {
    files: ["apps/web/**/*.{js,jsx,mjs,ts,tsx}"],
    settings: { next: { rootDir: "apps/web" } },
  },
];

export default eslintConfig;
