import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";

const medicalButtonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "btn-medical-primary",
        accent: "btn-medical-accent", 
        outline: "btn-medical-outline",
        ghost: "hover:bg-gray-100 text-gray-700 hover:text-gray-900",
      },
      size: {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface MedicalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof medicalButtonVariants> {
  asChild?: boolean;
}

const MedicalButton = forwardRef<HTMLButtonElement, MedicalButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(medicalButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
MedicalButton.displayName = "MedicalButton";

export { MedicalButton, medicalButtonVariants };