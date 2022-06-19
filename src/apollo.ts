import { InMemoryCache, ApolloClient, ApolloLink } from "@apollo/client";
import localforage from "localforage";
import { createUploadLink } from "apollo-upload-client";
import {
  persistQueue,
  QueueLink,
  LocalForageWrapper as QueueLocalForageWrapper,
} from "apollo-link-queue-persist";
import {
  persistCache,
  LocalForageWrapper as CacheLocalForageWrapper,
} from "apollo3-cache-persist";

const cache = new InMemoryCache({
  typePolicies: {
    Document: {
      fields: {
        meta: {
          merge: true,
        },
      },
    },
    FileInfo: {
      keyFields: ["hash"],
    },
  },
});

const uploadLink = createUploadLink({ uri: "http://localhost:4000/graphql" });

export const queueLink = new QueueLink();

export const client = new ApolloClient({
  cache,
  link: ApolloLink.from([queueLink, uploadLink]),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
    },
    query: {
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
});

await persistCache({
  cache,
  storage: new CacheLocalForageWrapper(localforage),
});

await persistQueue({
  queueLink,
  storage: new QueueLocalForageWrapper(localforage) as any,
  client,
  beforeRestore: null,
  onCompleted: null,
  onError: null,
});
