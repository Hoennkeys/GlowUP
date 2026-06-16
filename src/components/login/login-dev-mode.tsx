import * as React from "react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MOCK_LOGIN_HINTS } from "@/lib/auth/mock-users";

type LoginDevModeProps = {
  loading: boolean;
  onSelectProfile: (email: string, password: string) => void;
};

export function LoginDevMode({ loading, onSelectProfile }: LoginDevModeProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (email: string, password: string) => {
    setOpen(false);
    onSelectProfile(email, password);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-auto px-0 py-0 text-xs font-normal text-muted-foreground hover:bg-transparent hover:text-foreground"
        >
          • dev
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" side="top" className="w-80 p-3">
        <p className="mb-2 text-xs font-medium text-muted-foreground">Dev Mode — contas de teste</p>
        <div className="space-y-1">
          {MOCK_LOGIN_HINTS.map((hint) => (
            <button
              key={hint.email}
              type="button"
              disabled={loading}
              onClick={() => handleSelect(hint.email, hint.password)}
              className="w-full rounded-md border border-border bg-background p-2.5 text-left transition-colors hover:bg-accent disabled:opacity-50"
            >
              <p className="text-sm font-medium">{hint.nome}</p>
              <p className="text-xs text-muted-foreground">{hint.email}</p>
              <p className="mt-0.5 text-xs text-primary">{hint.tipo}</p>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}