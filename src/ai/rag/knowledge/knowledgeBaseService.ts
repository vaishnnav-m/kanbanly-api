import { IKnowledgeBaseService } from "../../../types/ai/IKnowledgeBaseService";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { Pinecone } from "@pinecone-database/pinecone";
import { config } from "../../../config";
import { PineconeStore } from "@langchain/pinecone";
import { KnowledgeRetriever } from "./knowledge.retriever";
import AppError from "../../../shared/utils/AppError";
import { HTTP_STATUS } from "../../../shared/constants/http.status";

export class KnowledgeBaseService implements IKnowledgeBaseService {
  private _knowledgeRetriever!: KnowledgeRetriever;
  private _initialized = false;
  constructor() {}

  async initialize(): Promise<void> {
    if (this._initialized) return;

    const embeddings = new GoogleGenerativeAIEmbeddings({
      modelName: "text-embedding-004",
      taskType: TaskType.RETRIEVAL_DOCUMENT,
    });

    const pinecone = new Pinecone({
      apiKey: config.vectorDB.PINECONE_API_KEY!,
    });

    const index = pinecone.Index(config.vectorDB.INDEX_NAME!);

    const store = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace: config.vectorDB.NAMESPACE,
    });

    this._knowledgeRetriever = new KnowledgeRetriever(store);
    this._initialized = true;
  }

  getRetriever() {
    if (!this._initialized) {
      throw new AppError(
        "KnowledgeBaseService not initialized",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }

    return this._knowledgeRetriever.retriver;
  }

  async retrieve(query: string): Promise<string> {
    if (!this._initialized) {
      await this.initialize();
    }

    return this._knowledgeRetriever.retrive(query);
  }
}
