import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // extend config bawaan Next.js
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // global ignore
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "prisma/**", // hasil generate Prisma
      "src/generated/**", // hasil generate (mis. zod, api client)
    ],
  },

  // global rules (berlaku di semua file)
  {
    rules: {
      "react-hooks/exhaustive-deps": "off", // ⬅️ disable global
    },
  },

  // override untuk file deklarasi (opsional tambahan)
  {
    files: ["**/*.d.ts"],
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "no-undef": "off",
    },
  },
];

export default eslintConfig;
