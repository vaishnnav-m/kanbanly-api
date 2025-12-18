export interface IKnowledgeRetriever {
  retrive(query: string): Promise<string>;
}
