import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

function GlowCard({
  className,
  hover,
  ...props
}: React.ComponentProps<typeof Card> & { hover?: boolean }) {
  return (
    <Card
      className={cn(
        "border-border/80 shadow-sm",
        hover && "glowup-card-hover cursor-pointer",
        className,
      )}
      {...props}
    />
  );
}

function GlowCardHeader({ className, ...props }: React.ComponentProps<typeof CardHeader>) {
  return <CardHeader className={cn("pb-3", className)} {...props} />;
}

function GlowCardTitle({ className, ...props }: React.ComponentProps<typeof CardTitle>) {
  return <CardTitle className={cn("text-base font-semibold", className)} {...props} />;
}

function GlowCardDescription({
  className,
  ...props
}: React.ComponentProps<typeof CardDescription>) {
  return <CardDescription className={cn("text-sm", className)} {...props} />;
}

function GlowCardContent({ className, ...props }: React.ComponentProps<typeof CardContent>) {
  return <CardContent className={cn("pt-0", className)} {...props} />;
}

function GlowCardFooter({ className, ...props }: React.ComponentProps<typeof CardFooter>) {
  return <CardFooter className={cn("pt-0", className)} {...props} />;
}

export {
  GlowCard,
  GlowCardHeader,
  GlowCardTitle,
  GlowCardDescription,
  GlowCardContent,
  GlowCardFooter,
};
