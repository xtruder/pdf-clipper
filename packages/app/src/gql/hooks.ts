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

export type UseMyQueryArgs<Variables, Data> = UseQueryArgs<Variables, Data> & {
  context?: Partial<OperationContextWithOffline>;
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

  return useQuery({ ...args, context });
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
