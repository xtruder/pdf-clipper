import {
  AnyVariables,
  OperationContext,
  OperationResult,
  TypedDocumentNode,
  useMutation,
  UseMutationState,
  useQuery,
  UseQueryArgs,
  UseQueryResponse,
} from "urql";
import { DocumentNode } from "graphql";
import { createContext, useContext, useMemo } from "react";

export const GqlContext = createContext<{
  offline?: boolean;
}>({ offline: false });

export type OperationContextWithOffline = OperationContext & {
  offline?: boolean;
};

export type UseMyQueryArgs<Variables extends AnyVariables, Data> = UseQueryArgs<
  Variables,
  Data
> & {
  context?: Partial<MyOperationContext>;
  throwOnError?: boolean;
};

export function useMyQuery<
  Data = any,
  Variables extends AnyVariables = AnyVariables
>(args: UseMyQueryArgs<Variables, Data>): UseQueryResponse<Data, Variables> {
  const extraContext = useContext(GqlContext);

  const context = useMemo(
    () => ({ ...(extraContext ?? {}), ...(args.context ?? {}) }),
    [args.context, extraContext]
  );

  const [{ data, error, ...extra }, refetch] = useQuery({
    ...args,
    variables: { ...(args.variables ?? {}), source: context.source },
    context,
  });

  if (args.throwOnError && error) {
    throw error;
  }

  return [{ data, error, ...extra }, refetch];
}

export function useMyMutation<
  Data = any,
  Variables extends AnyVariables = AnyVariables
>(
  query: DocumentNode | TypedDocumentNode<Data, Variables> | string
): [
  UseMutationState<Data, Variables>,
  (
    variables: Variables,
    context?: Partial<OperationContext>
  ) => Promise<OperationResult<Data, Variables>>
] {
  const [state, execute] = useMutation(query);
  const extraContext = useContext(GqlContext);

  const myExecute = (
    variables: Variables,
    context?: Partial<OperationContextWithOffline>
  ) => execute(variables, { ...(extraContext ?? {}), ...(context ?? {}) });

  return [state, myExecute];
}
