import { ApolloClient } from "@apollo/client";
import {
  CreateDocumentImagePostPolicyMutation,
  CreateDocumentImagePostPolicyMutationVariables,
  CreateDocumentImagePostPolicyDocument,
} from "./generated/graphql";
import { handleFetchResp } from "./util";

export interface S3PostPolicyParams {
  postURL: string;
  formData: Record<string, string>;
  expiration: Date;
}

export abstract class S3PostPolicyFileUploader {
  private postPolicyParams?: S3PostPolicyParams;

  async uploadFile(key: string, file: Blob): Promise<void> {
    const { formData, postURL } = await this.getPostPolicy();

    const form = new FormData();

    Object.entries({
      ...formData,
      key,
    }).forEach(([key, value]) => form.append(key, value));

    form.append("file", file);

    // upload file using multipart upload
    const resp = await fetch(postURL, {
      method: "POST",
      body: form,
    });

    if (!resp.ok) {
      throw new Error(
        `Error uploading file ${resp.status}: ${resp.statusText}`
      );

      // TODO: handle potential expiration error
    }
  }

  async getPostPolicy(): Promise<S3PostPolicyParams> {
    // if policy exists try to use existing if not expired
    if (
      this.postPolicyParams &&
      this.postPolicyParams.expiration > new Date()
    ) {
      return this.postPolicyParams;
    }

    return this.createPostPolicy();
  }

  abstract createPostPolicy(): Promise<S3PostPolicyParams>;
}

export class S3DocumentImageUploader extends S3PostPolicyFileUploader {
  constructor(private client: ApolloClient<any>, private documentId: string) {
    super();
  }

  async createPostPolicy(): Promise<S3PostPolicyParams> {
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 1);

    const resp = handleFetchResp(
      await this.client.mutate<
        CreateDocumentImagePostPolicyMutation,
        CreateDocumentImagePostPolicyMutationVariables
      >({
        mutation: CreateDocumentImagePostPolicyDocument,
        variables: {
          documentId: this.documentId,
        },
      })
    );

    return { ...resp?.createDocumentImagePostPolicy!, expiration };
  }
}
