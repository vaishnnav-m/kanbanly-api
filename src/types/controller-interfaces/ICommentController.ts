import { controllerMethod } from "../common/ControllerMethod";

export interface ICommentController {
  createComment: controllerMethod;
  getAllComments: controllerMethod;
}
