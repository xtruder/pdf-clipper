import { AtomEffect, DefaultValue } from "recoil";
import { RxCollection, RxDocument, RxQuery } from "rxdb";

export const localStorageEffect: (key: string) => AtomEffect<any> =
  (key) =>
  ({ setSelf, onSet }) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }

    onSet((newValue, _, isReset) => {
      isReset
        ? localStorage.removeItem(key)
        : localStorage.setItem(key, JSON.stringify(newValue));
    });
  };

export const rxQueryEffect: <T>(
  query: RxQuery<T, RxDocument<T, {}>[]>
) => AtomEffect<T[]> =
  (query) =>
  ({ setSelf }) => {
    const sub = query.$.subscribe((values) =>
      setSelf(values.map((val) => val.toJSON() as any))
    );

    return () => sub.unsubscribe();
  };

export const rxCollectionEffect: <
  T extends Record<string, any>,
  K extends keyof T
>(
  query: RxQuery<T, RxDocument<T, {}>[]>,
  key: K,
  collection: RxCollection<T>
) => AtomEffect<T[]> =
  (query, key, collection) =>
  ({ setSelf, onSet, trigger }) => {
    if (trigger === "get") {
      setSelf(
        query.exec().then((docs) => docs.map((doc) => doc.toJSON() as any))
      );
    }

    onSet(async (newValue, oldValue, isReset) => {
      if (isReset && !(oldValue instanceof DefaultValue)) {
        await collection.bulkRemove(oldValue.map((doc) => doc[key] as string));
        return;
      }

      await Promise.all(newValue.map((doc) => collection.atomicUpsert(doc)));

      // get ids of documents that need to be deleted
      const deleteIds = (oldValue instanceof DefaultValue ? [] : oldValue)
        .filter((doc) => !newValue.find((old) => old[key] === doc[key]))
        .map((doc) => doc[key]);

      await collection.bulkRemove(deleteIds);
    });

    const sub = query.$.subscribe((docs) =>
      setSelf(docs.map((d) => d.toJSON() as any))
    );

    return () => sub.unsubscribe();
  };

export const rxDocumentEffect: <T>(
  collection: RxCollection<T>,
  key: string
) => AtomEffect<T> =
  (collection, key) =>
  ({ setSelf, onSet, trigger, resetSelf }) => {
    if (trigger === "get") {
      setSelf(
        collection
          .findOne(key)
          .exec()
          .then(async (value) => {
            if (value) return value.toJSON() as any;
            else return new DefaultValue();
          })
      );
    }

    onSet(async (newValue, oldValue, isReset) => {
      const doc = await collection.findOne(key).exec();

      if (isReset) {
        if (doc) await doc.remove();
        return;
      }

      if (!doc && newValue) {
        await collection.atomicUpsert(newValue);
        return;
      }

      if (newValue === oldValue) return;

      console.log("writing");
      await doc?.atomicPatch(newValue!);
    });

    const updateSub = collection.update$.subscribe((changeEvent) => {
      if (changeEvent.documentId !== key) return;
      setSelf(changeEvent.documentData as any);
    });

    const removeSub = collection.remove$.subscribe((changeEvent) => {
      if (changeEvent.documentId !== key) return;
      resetSelf();
    });

    return () => {
      updateSub.unsubscribe();
      removeSub.unsubscribe();
    };
  };
