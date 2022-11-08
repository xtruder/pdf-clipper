import { useQuery, useMutation } from "urql";
import { createContext, useContext, useMemo } from "react";

import type {
  AnyVariables,
  OperationContext,
  OperationResult,
  TypedDocumentNode,
  UseMutationState,
  UseQueryArgs,
  UseQueryResponse,
  UseQueryState,
} from "urql";
import type { DocumentNode } from "graphql";

export type DataSource = "local" | "remote";

export const GqlContext = createContext<{
  source?: DataSource;
  propagateError?: boolean;
}>({ source: "remote" });

export type MyOperationContext = OperationContext & {
  source?: DataSource;
  propagateError?: boolean;
  errorPrefix?: string;
};

export type UseMyQueryArgs<Variables extends AnyVariables, Data> = UseQueryArgs<
  Variables,
  Data
> & {
  context?: Partial<MyOperationContext>;

  /** whether to throw if error has been raised */
  throwOnError?: boolean;

  /** whether to suspend query when loading (same as context.suspense) */
  suspend?: boolean;

  /** which data source to use */
  source?: DataSource;

  /** whether to propagate error (handled by error exchange) */
  propagateError?: boolean;

  /** error prefix for propagated error */
  errorPrefix?: string;
};

export function useMyQuery<
  Data = any,
  Variables extends AnyVariables = AnyVariables
>(
  args: UseMyQueryArgs<Variables, Data> & { throwOnError: true }
): [
  UseQueryState<Data, Variables> & {
    data: Data;
  },
  (opts?: Partial<OperationContext>) => void
];
export function useMyQuery<
  Data = any,
  Variables extends AnyVariables = AnyVariables
>(args: UseMyQueryArgs<Variables, Data>): UseQueryResponse<Data, Variables>;
export function useMyQuery<
  Data = any,
  Variables extends AnyVariables = AnyVariables
>(args: UseMyQueryArgs<Variables, Data>): UseQueryResponse<Data, Variables> {
  const extraContext = useContext(GqlContext);

  const context = useMemo(
    () => ({
      ...(extraContext ?? {}),
      ...(args.context ?? {}),
      ...(args.suspend && { suspense: args.suspend }),
      ...(args.source && { source: args.source }),
      propagateError: args.propagateError,
      errorPrefix: args.errorPrefix,
    }),
    [
      args.context,
      extraContext.source,
      extraContext.propagateError,
      args.suspend,
      args.source,
      args.propagateError,
      args.errorPrefix,
    ]
  );

  const [state, refetch] = useQuery({
    ...args,
    variables: { ...(args.variables ?? {}), source: context.source },
    context,
  });

  if (state.error && args.throwOnError) {
    throw state.error;
  }

  return [state, refetch];
}

export type UseMyMutationArgs = {
  throwOnError?: boolean;
  propagateError?: boolean;
  errorPrefix?: string;
};

export function useMyMutation<
  Data = any,
  Variables extends AnyVariables = AnyVariables
>(
  query: DocumentNode | TypedDocumentNode<Data, Variables> | string,
  args?: UseMyMutationArgs & { throwOnError?: true }
): [
  UseMutationState<Data, Variables>,
  (
    variables: Variables,
    context?: Partial<OperationContext>
  ) => Promise<OperationResult<Data, Variables> & { data: Data }>
];
export function useMyMutation<
  Data = any,
  Variables extends AnyVariables = AnyVariables
>(
  query: DocumentNode | TypedDocumentNode<Data, Variables> | string,
  args?: UseMyMutationArgs
): [
  UseMutationState<Data, Variables>,
  (
    variables: Variables,
    context?: Partial<OperationContext>
  ) => Promise<OperationResult<Data, Variables>>
] {
  const [state, execute] = useMutation(query);
  const extraContext = useContext(GqlContext);

  const myExecute = async (
    variables: Variables,
    context?: Partial<MyOperationContext>
  ) => {
    const result = await execute(variables, {
      ...(extraContext ?? {}),
      ...(context ?? {}),
      propagateError: args?.propagateError,
      errorPrefix: args?.errorPrefix,
    });

    if (result.error && args?.throwOnError) {
      throw result.error;
    }

    return result;
  };

  return [state, myExecute];
}
