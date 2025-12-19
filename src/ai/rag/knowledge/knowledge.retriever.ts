import { PineconeStore } from "@langchain/pinecone";

export class KnowledgeRetriever {
  constructor(private _vectorStore: PineconeStore) {}

  get retriver() {
    return this._vectorStore.asRetriever();
  }

  async retrive(query: string): Promise<string> {
    const results = await this._vectorStore.similaritySearch(query, 4);
    return results.map((result) => result.pageContent).join("\n\n");
  }
}
