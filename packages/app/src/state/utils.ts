import { atom, Getter } from "jotai";
import { atomWithObservable } from "jotai/utils";
import { RxDocument, RxQuery } from "rxdb";
import { filter, map, Observable } from "rxjs";

export const syncableRxDocumentAtom = <T>(
  createQuery: (get: Getter) => RxQuery<T, RxDocument<T, any> | null>,
  defaultValue:
    | ((get: Getter, query: RxQuery<T, RxDocument<T> | null>) => Partial<T>)
    | Partial<T>
) => {
  // create query atom
  const queryAtom = atom((get) => createQuery(get));

  // create observable atom
  const queryObservableAtom = atom<
    Observable<{ doc: RxDocument<T>; value: T }>
  >((get) =>
    get(queryAtom).$.pipe(
      filter((v) => !!v),
      map((doc) => ({ doc, value: doc.toJSON() }))
    )
  );

  const defaultValueAtom = atom((get) =>
    defaultValue instanceof Function
      ? defaultValue(get, get(queryAtom))
      : defaultValue
  );

  // observe value changes, start with null, so we can check whether value
  // already exists and upsert it in initAtom
  const observerWithNullAtom = atomWithObservable(
    (get) => get(queryObservableAtom),
    { initialValue: null }
  );

  const observerAtom = atomWithObservable((get) => get(queryObservableAtom));

  const syncableAtom = atom<T, Partial<T>>(
    (get) => {
      const currentValue = get(observerWithNullAtom);
      if (currentValue) return currentValue.value;

      const query = get(queryAtom);
      const defaultValue = get(defaultValueAtom);

      (async () => {
        if (await query.exec()) return;

        try {
          await query.collection.insert(defaultValue as T);
        } catch (err: any) {
          if (
            err instanceof Error &&
            "code" in err &&
            err["code"] === "COL19"
          ) {
            return;
          }

          throw err;
        }
      })();

      return get(observerAtom).value;
    },
    async (get, _set, value) => {
      const query = get(queryAtom);
      const currentValue = get(observerWithNullAtom);

      if (!currentValue) {
        const defaultValue = get(defaultValueAtom);

        await query.collection.atomicUpsert({
          ...defaultValue,
          ...value,
        });
      } else {
        await currentValue.doc.atomicPatch(value);
      }
    }
  );

  return syncableAtom;
};

export const syncableRxDocumentsAtom = <T extends Record<string, any>>(
  createQuery: (get: Getter) => RxQuery<T, RxDocument<T, any>[]>
) => {
  const queryAtom = atom((get) => createQuery(get));

  const observerAtom = atomWithObservable((get) => get(queryAtom).$);

  const syncableAtom = atom<
    RxDocument<T>[],
    | {
        action: "create";
        value?: T;
      }
    | {
        action: "update";
        value?: Partial<T>;
      }
    | {
        action: "remove";
        value?: string;
      }
  >(
    (get) => get(observerAtom),
    async (get, _set, update) => {
      const query = get(queryAtom);

      const collection = query.collection;
      const primaryPath = collection.schema.primaryPath;

      const { action, value } = update;

      if (!value) return;

      switch (action) {
        case "create":
          await collection.insert(value);
          break;
        case "update":
          await collection.atomicUpsert(value);
          break;
        case "remove":
          await collection
            .findOne({
              selector: {
                [primaryPath]: value,
              },
            })
            .remove();
      }
    }
  );

  return syncableAtom;
};
