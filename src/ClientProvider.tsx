import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";
import { suspend } from "suspend-react";
import { useLocalStorageState } from "ahooks";
import { v4 as uuid } from "uuid";
import { Provider as UrqlProvider } from "urql";

import { Database } from "./offline";
import { createClient } from "./gql/client";

type ClientContext = {
  resetClient: () => void;
};

const ClientContext = createContext<ClientContext>({
  resetClient: () => null,
});

export const ClientProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  // create offline database instance
  const db = useMemo(() => new Database(), []);

  // get current account id from local storage
  const [currentAccountId, setCurrentAccountId] = useLocalStorageState(
    "currentAccountId",
    {
      defaultValue: () => uuid(),
      serializer: (val) => val,
      deserializer: (val) => val,
    }
  );

  // create initial account if it does not exist
  suspend(async () => {
    const account = await db.accounts.get(currentAccountId);
    if (!account) {
      await db.accounts.add({ id: currentAccountId });
      setCurrentAccountId(currentAccountId);
    }
  }, []);

  const [client, setClient] = useState(
    createClient({
      url: "http://localhost:4000/graphql",
      accountId: currentAccountId,
      db,
    })
  );

  return (
    <ClientContext.Provider
      value={{
        resetClient: () =>
          setClient(
            createClient({
              url: "http://localhost:4000/graphql",
              accountId: currentAccountId,
              db,
            })
          ),
      }}
    >
      <UrqlProvider value={client}>{children}</UrqlProvider>
    </ClientContext.Provider>
  );
};

export const useClient = () => useContext(ClientContext);
