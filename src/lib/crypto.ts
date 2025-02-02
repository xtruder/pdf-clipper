function arrayBufferToHex(buf: ArrayBuffer): string {
  return Array.prototype.map
    .call(new Uint8Array(buf), (x) => ("00" + x.toString(16)).slice(-2))
    .join("");
}

export async function sha256(data: BufferSource) {
  const buf = await crypto.subtle.digest("SHA-256", data);

  return arrayBufferToHex(buf);
}
