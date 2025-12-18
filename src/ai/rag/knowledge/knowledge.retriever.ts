import { IKnowledgeRetriever } from "../../../types/ai/IKnowledgeRetriever";
import { inject, injectable } from "tsyringe";
import { PineconeStore } from "@langchain/pinecone";

@injectable()
export class KnowledgeRetriever implements IKnowledgeRetriever {
  constructor(@inject(PineconeStore) private _vectorStore: PineconeStore) {}

  async retrive(query: string): Promise<string> {
    const results = await this._vectorStore.similaritySearch(query, 4);
    return results.map((result) => result.pageContent).join("\n\n");
  }
}
