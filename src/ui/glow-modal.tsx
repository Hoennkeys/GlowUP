import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

function GlowModal(props: React.ComponentProps<typeof Dialog>) {
  return <Dialog {...props} />;
}

function GlowModalTrigger(props: React.ComponentProps<typeof DialogTrigger>) {
  return <DialogTrigger {...props} />;
}

function GlowModalContent({ className, ...props }: React.ComponentProps<typeof DialogContent>) {
  return (
    <DialogContent
      className={cn("rounded-xl border-border/80 sm:max-w-md", className)}
      {...props}
    />
  );
}

function GlowModalHeader(props: React.ComponentProps<typeof DialogHeader>) {
  return <DialogHeader {...props} />;
}

function GlowModalTitle({ className, ...props }: React.ComponentProps<typeof DialogTitle>) {
  return <DialogTitle className={cn("text-lg font-semibold", className)} {...props} />;
}

function GlowModalDescription(props: React.ComponentProps<typeof DialogDescription>) {
  return <DialogDescription {...props} />;
}

function GlowModalFooter(props: React.ComponentProps<typeof DialogFooter>) {
  return <DialogFooter {...props} />;
}

export {
  GlowModal,
  GlowModalTrigger,
  GlowModalContent,
  GlowModalHeader,
  GlowModalTitle,
  GlowModalDescription,
  GlowModalFooter,
};
