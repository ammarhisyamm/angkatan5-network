import { createTV } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

export { type VariantProps };
export const tv = createTV({
  twMergeConfig: {
    extend: {
      classGroups: {},
    },
  },
});
