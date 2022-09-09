import net from "net";

export const stableUUID = () => {
  const base = "9134e286-6f71-427a-bf00-";
  let current = 100000000000;

  return {
    v4: () => {
      console.log("mock called");
      const uuid = base + current.toString();
      current++;

      return uuid;
    },
  };
};

export function getFreePort(): Promise<number> {
  const srv = net.createServer();

  return new Promise((resolve) => {
    srv.listen(0, () => {
      const port = (srv.address()! as net.AddressInfo).port;
      srv.close(() => resolve(port));
    });
  });
}
