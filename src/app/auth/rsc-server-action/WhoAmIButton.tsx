"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function WhoAmIButton({
  whoAmI,
}: {
  whoAmI: () => Promise<string>;
}) {
  const [name, setName] = useState<string>();

  return (
    <div className="flex flex-col items-center justify-between gap-4">
      <Button
        variant="outline"
        onClick={async () => {
          setName(await whoAmI());
        }}
      >
        Who Am I?
      </Button>
      {name && <div>{name}</div>}
    </div>
  );
}
