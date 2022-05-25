import { AtomEffect, DefaultValue, SerializableParam } from "recoil";
import Observable from "zen-observable";
import { MutableResource, SyncableResource } from "~/persistence/persistence";

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

export const graphqlEffect: <T>(methods: {
  get: () => Promise<T | null>;
  reset?: (oldValue: T | DefaultValue) => Promise<any>;
  write?: (newValue: T, oldValue: T | DefaultValue) => Promise<T | null>;
  subscribe?: () => Observable<T>;
}) => AtomEffect<T> =
  ({ get, write, reset, subscribe }) =>
  ({ setSelf, onSet, trigger }) => {
    if (trigger === "get") {
      setSelf(
        get().then((value) => {
          if (value) return value;
          else return new DefaultValue();
        })
      );
    }

    onSet(async (newValue, oldValue, isReset) => {
      if (isReset && reset) {
        return await reset(oldValue);
      }

      if (!newValue) return;
      if (newValue === oldValue || !write) return;
      if (newValue instanceof DefaultValue) return;

      const writeResult = await write(newValue, oldValue);

      if (writeResult) setSelf(writeResult);
    });

    if (subscribe) subscribe().forEach((value) => setSelf(value));
  };

export const resourceEffect: <T>(
  resource: SyncableResource<T> | MutableResource<T>
) => AtomEffect<T> =
  (syncable) =>
  ({ setSelf, onSet, trigger }) => {
    // load initial value from syncable resource
    if (trigger === "get") {
      setSelf(
        syncable.get().then((value) => {
          if (value) return value;
          else return new DefaultValue();
        })
      );
    }

    // when value is updated write it to syncable
    onSet(async (newValue, oldValue, isReset) => {
      if (isReset) {
        return syncable.reset();
      }
      if (newValue === oldValue) return;

      await syncable.write(newValue);
    });

    if ("subscribe" in syncable) {
      // subscribe to changes in syncable
      syncable.subscribe((newValue) => {
        // reset to default value if newValue is null
        if (newValue === null) return setSelf(new DefaultValue());

        setSelf(newValue);
      });
    }
  };
