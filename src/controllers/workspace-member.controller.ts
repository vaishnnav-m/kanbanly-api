import { Request, Response } from "express";
import { IWorkspaceMemberController } from "../types/controller-interfaces/IWorkspaceMemberController";
import { WorkspaceMemberDto } from "../types/dtos/workspaces/workspace-member.dto";
import { inject, injectable } from "tsyringe";
import { IWorkspaceMemberService } from "../types/service-interface/IWorkspaceMemberService";
import { HTTP_STATUS } from "../shared/constants/http.status";

@injectable()
export class WorkspaceMemberController implements IWorkspaceMemberController {
  constructor(
    @inject("IWorkspaceMemberService")
    private _workspaceMemberService: IWorkspaceMemberService
  ) {}
  
  async addUser(req: Request, res: Response) {
    const { userId, workspaceId, role } = req.body as WorkspaceMemberDto;
    await this._workspaceMemberService.addMember({ userId, workspaceId, role });

    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: "User added to workspace successfully" });
  }
}
