import { createReadStream } from "fs";
import { stat } from "fs/promises";
import { Client, PostPolicyResult } from "minio";
import fetch from "node-fetch";
import FormData from "form-data";

const mc = new Client({
  endPoint: "localhost",
  port: 9000,
  useSSL: false,
  accessKey: "qo3SQTpHuE2IMfU7",
  secretKey: "PaHQqhz1p9ZZQvLFbhM5PQhAUILaJmLw",
});

async function uploadFile(
  { formData, postURL }: PostPolicyResult,
  fileName: string,
  key: string
) {
  const form = new FormData();
  Object.entries({ ...formData, key }).forEach(([key, value]) =>
    form.append(key, value)
  );

  const { size: fileSize } = await stat(fileName);
  form.append("file", createReadStream(fileName), { knownLength: fileSize });

  const resp = await fetch(postURL, {
    method: "POST",
    body: form,
  });

  if (!resp.ok) throw new Error(resp.statusText);
}

async function main() {
  const policy = mc.newPostPolicy();

  var expires = new Date();
  expires.setSeconds(24 * 60 * 60 * 10);

  policy.setExpires(expires);
  policy.setBucket("images");
  policy.setKeyStartsWith("user/");
  policy.setContentLengthRange(10, 1024 * 1024);
  policy.setContentType("text/plain");

  const result = await mc.presignedPostPolicy(policy);

  await uploadFile(result, "file.txt", "user/fancy-file.txt");
  await uploadFile(result, "file.txt", "user/another-fancy-file.txt");
}

main();
