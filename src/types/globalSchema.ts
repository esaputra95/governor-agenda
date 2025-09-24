import { z } from "zod";

export const OptionSelectSchema = z.object({
  label: z.string(),
  value: z.union([z.string(), z.number()], {
    error: "Value harus berupa string atau number",
  }),
});
