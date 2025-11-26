import { IComment } from "../entities/ICommnet";
import { IBaseRepository } from "./IBaseRepositroy";

export interface ICommentRepository extends IBaseRepository<IComment> {
  getCommentsWithAuthor(
    workspaceId: string,
    taskId: string,
    limit: number,
    skip: number,
    commentId?: string
  ): Promise<IComment[]>;
}
