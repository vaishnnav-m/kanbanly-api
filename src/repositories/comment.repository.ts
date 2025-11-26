import { injectable } from "tsyringe";
import { commentModel } from "../models/comment.model";
import { IComment } from "../types/entities/ICommnet";
import { ICommentRepository } from "../types/repository-interfaces/ICommentRepository";
import { BaseRepository } from "./base.repository";

@injectable()
export class CommentRepository
  extends BaseRepository<IComment>
  implements ICommentRepository
{
  constructor() {
    super(commentModel);
  }
}
