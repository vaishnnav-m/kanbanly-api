import { TaskType } from "@google/generative-ai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import "dotenv/config";
import { config } from "../../../config";
import { PineconeStore } from "@langchain/pinecone";
import logger from "../../../logger/winston.logger";
import { APP_KNOWLEDGE_DOCS } from "./knowledge-docs";

async function seedKnowledge() {
  const embeddings = new GoogleGenerativeAIEmbeddings({
    modelName: "text-embedding-004",
    taskType: TaskType.RETRIEVAL_DOCUMENT,
  });

  const pinecone = new Pinecone({
    apiKey: config.vectorDB.PINECONE_API_KEY!,
  });

  const indexName = config.vectorDB.INDEX_NAME!;

  logger.info(`Checking if index ${indexName} exists`);
  const indexes = await pinecone.listIndexes();
  const exists = indexes.indexes?.some((i) => i.name === indexName);

  if (!exists) {
    logger.info(`Index ${indexName} not exists creating one`);
    await pinecone.createIndex({
      name: indexName,
      dimension: 768,
      metric: "cosine",
      spec: {
        serverless: {
          cloud: "aws",
          region: "us-east-1",
        },
      },
    });
  }

  const index = pinecone.index(indexName);

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: index,
    namespace: config.vectorDB.NAMESPACE,
  });

  const docs = APP_KNOWLEDGE_DOCS.filter(
    (d) => d.pageContent && d.pageContent.trim().length > 0
  );

  if (!docs.length) {
    throw new Error("No valid documents to embed");
  }

  logger.info(`Seeding app knowledge into Pinecone...`);
  await vectorStore.addDocuments(docs);
  logger.info(`Knowledge seeding completed.`);
}

seedKnowledge()
  .then(() => process.exit(0))
  .catch((err) => {
    logger.warn("Knowledge seeding failed", err);
    process.exit(1);
  });
