// Type definitions for Deno runtime
// This file fixes TypeScript errors in VSCode for Deno edge functions

declare namespace Deno {
  export const env: {
    get(key: string): string | undefined;
  };

  export function serve(
    handler: (request: Request) => Response | Promise<Response>,
  ): void;
}

// Declare global types available in Deno runtime
declare global {
  const Deno: typeof Deno;
}

export { };

