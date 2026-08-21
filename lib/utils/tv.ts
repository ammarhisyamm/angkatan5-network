import { createTV } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";
import { cn } from "./cn";

export { type VariantProps };
export const tv = createTV({
  twMergeConfig: {
    extend: {
      classGroups: {
        // alignui class groups
      },
    },
  },
});
