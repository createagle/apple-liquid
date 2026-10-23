"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "cn";
import { OTPInput, OTPInputContext } from "input-otp";
import { MinusIcon } from "lucide-react";

import type { InputSize } from "@/components/ui/input/input";

/**
 * One box per character, sized on the same scale as Input and Button so a
 * code field sits flush with the buttons under it. The size is set once on
 * <InputOTP> and read by every slot through context.
 */
const slotVariants = cva(
  [
    "relative flex flex-1 items-center justify-center bg-field",
    "font-medium tabular-nums text-foreground",
    "shadow-[0_0_0_1px_var(--field-border)] outline-none",
    "transition-[background-color,box-shadow] duration-200 ease-apple",
    "data-[active=true]:z-10 data-[active=true]:ring-[3px] data-[active=true]:ring-ring/45",
    "aria-invalid:shadow-[0_0_0_1px_var(--destructive)]",
    "data-[active=true]:aria-invalid:ring-destructive/30",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "h-7 rounded-[8px] text-[13px]",
        default: "h-[34px] rounded-[10px] text-[15px]",
        lg: "h-[50px] rounded-[12px] text-[17px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

const caretHeights: Record<InputSize, string> = {
  sm: "h-3.5",
  default: "h-4",
  lg: "h-5",
};

const InputOTPSizeContext = React.createContext<InputSize>("default");

/** `Omit` that keeps each member of a union intact (OTPInput's props are one). */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;

function InputOTP({
  className,
  containerClassName,
  size = "default",
  ...props
}: DistributiveOmit<React.ComponentProps<typeof OTPInput>, "size"> & {
  containerClassName?: string;
  size?: InputSize;
}) {
  return (
    <InputOTPSizeContext.Provider value={size}>
      <OTPInput
        data-slot="input-otp"
        data-size={size}
        containerClassName={cn(
          "cn-input-otp flex w-full items-center has-disabled:opacity-50",
          containerClassName,
        )}
        spellCheck={false}
        className={cn("disabled:cursor-not-allowed", className)}
        {...props}
      />
    </InputOTPSizeContext.Provider>
  );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex w-full items-center gap-2", className)}
      {...props}
    />
  );
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number;
}) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const size = React.useContext(InputOTPSizeContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(slotVariants({ size }), className)}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className={cn(
              "w-px animate-caret-blink bg-foreground duration-1000",
              caretHeights[size],
            )}
          />
        </div>
      )}
    </div>
  );
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      className="flex items-center [&_svg:not([class*='size-'])]:size-4"
      role="separator"
      {...props}
    >
      <MinusIcon />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
