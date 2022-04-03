import { AtomEffect, DefaultValue } from "recoil";
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
      syncable.subscribe((newValue) => setSelf(newValue));
    }
  };
