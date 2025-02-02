import { ExecutionArgs } from "graphql";

export function getExecutionArgsContext<T>(args: ExecutionArgs): T | undefined {
  const symbol = Object.getOwnPropertySymbols(args.contextValue).find(
    (sym) => sym.toString() === "Symbol(originalContext)"
  );

  return symbol ? (args.contextValue as any)[symbol] : undefined;
}
