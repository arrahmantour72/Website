// Additional button variants for special use cases
import { cva } from "class-variance-authority";

export const specialButtonVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        hero: "gradient-primary text-white hover:shadow-glow",
        "hero-outline": "border-2 border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-primary",
      },
      size: {
        default: "h-10 py-2 px-6",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
      },
    },
    defaultVariants: {
      variant: "hero",
      size: "default",
    },
  }
);
