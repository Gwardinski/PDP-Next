"use client";

import { useState } from "react";

export default function WhoAmIButton({
  whoAmI,
}: {
  whoAmI: () => Promise<string>;
}) {
  const [name, setName] = useState<string>();

  return (
    <div className="flex gap-2 items-center justify-between">
      <button
        className="border border-neutral-700 p-2 rounded-md w-fit"
        onClick={async () => {
          setName(await whoAmI());
        }}
      >
        Who Am I?
      </button>
      {name && <div>{name}</div>}
    </div>
  );
}
