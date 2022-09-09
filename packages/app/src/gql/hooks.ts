import {
  AnyVariables,
  OperationContext,
  useQuery,
  UseQueryArgs,
  UseQueryResponse,
} from "urql";

export type UseMyQueryArgs<Variables, Data> = UseQueryArgs<Variables, Data> & {
  context?: Partial<OperationContext & { offline?: boolean }>;
};

export function useMyQuery<
  Data = any,
  Variables extends AnyVariables = AnyVariables
>(args: UseMyQueryArgs<Variables, Data>): UseQueryResponse<Data, Variables> {
  return useQuery(args);
}
