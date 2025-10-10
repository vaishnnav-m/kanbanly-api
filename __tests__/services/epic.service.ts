"reflect-metadata"
import mongoose from "mongoose";
import { EpicService } from "../../src/services/epic.service";
import { WorkspaceMemberService } from "../../src/services/workspace-member.service";
import { WorkItemRepository } from "../../src/repositories/task.repository";
import { EpicRepository } from "../../src/repositories/epic.repository";
import AppError from "../../src/shared/utils/AppError";
import { workspaceRoles } from "../../src/types/dtos/workspaces/workspace-member.dto";

// Mock all the dependencies
jest.mock("mongoose");
jest.mock("../../src/services/workspace-member.service");
jest.mock("../../src/repositories/task.repository");
jest.mock("../../src/repositories/epic.repository");

describe("EpicService", () => {
  let epicService: EpicService;
  let mockWorkspaceMemberService: jest.Mocked<WorkspaceMemberService>;
  let mockTaskRepo: jest.Mocked<WorkItemRepository>;
  let mockEpicRepo: jest.Mocked<EpicRepository>;
  let mockSession: any;

  beforeEach(() => {
    // Create fresh mocks for each test
    mockWorkspaceMemberService = new WorkspaceMemberService(
      null as any,
      null as any,
      null as any
    ) as jest.Mocked<WorkspaceMemberService>;
    mockTaskRepo = new WorkItemRepository() as jest.Mocked<WorkItemRepository>;
    mockEpicRepo = new EpicRepository() as jest.Mocked<EpicRepository>;

    // Mock the mongoose transaction helper
    mockSession = {
      withTransaction: jest.fn(async (fn) => await fn()), // A simple mock that just runs the callback
      endSession: jest.fn(),
    };
    (mongoose.startSession as jest.Mock).mockResolvedValue(mockSession);

    // Instantiate the service with mocked dependencies
    epicService = new EpicService(
      mockEpicRepo,
      mockWorkspaceMemberService,
      mockTaskRepo
    );
  });

  // Test Case 1: Happy Path - Successful Deletion
  it("✅ should delete the epic and detach tasks for a user with sufficient permission", async () => {
    // Arrange: User is an admin
    mockWorkspaceMemberService.getCurrentMember.mockResolvedValue({
      role: workspaceRoles.owner,
    } as any);

    // Act
    await epicService.deleteEpic("userId1", "epicId1", "workspaceId1");

    // Assert
    expect(mockWorkspaceMemberService.getCurrentMember).toHaveBeenCalledWith(
      "workspaceId1",
      "userId1"
    );
    expect(mockTaskRepo.detachByEpicId).toHaveBeenCalledWith("epicId1", {
      session: mockSession,
    });
    expect(mockEpicRepo.delete).toHaveBeenCalledWith({ epicId: "epicId1" });
    expect(mockSession.endSession).toHaveBeenCalledTimes(1);
  });

  // Test Case 2: Failure due to insufficient permissions
  it("❌ should throw an error if the user is just a member", async () => {
    // Arrange: User is a member
    mockWorkspaceMemberService.getCurrentMember.mockResolvedValue({
      role: workspaceRoles.member,
    } as any);

    // Act & Assert
    await expect(
      epicService.deleteEpic("userId1", "epicId1", "workspaceId1")
    ).rejects.toThrow(new AppError("Insufficient permission", 400)); // Use your actual constants

    // Verify no database operations were attempted
    expect(mockTaskRepo.detachByEpicId).not.toHaveBeenCalled();
    expect(mockEpicRepo.delete).not.toHaveBeenCalled();
  });

  // Test Case 3: Failure due to a database error during transaction
  it("💣 should abort the transaction and re-throw the error if detaching tasks fails", async () => {
    const dbError = new Error("Database connection failed");

    // Arrange: User is an admin, but the first repo call will fail
    mockWorkspaceMemberService.getCurrentMember.mockResolvedValue({
      role: workspaceRoles.owner,
    } as any);
    mockTaskRepo.detachByEpicId.mockRejectedValue(dbError); // Simulate failure

    // Act & Assert
    await expect(
      epicService.deleteEpic("userId1", "epicId1", "workspaceId1")
    ).rejects.toThrow(dbError);

    // Verify that the second operation (delete) was never attempted
    expect(mockEpicRepo.delete).not.toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalledTimes(1); // Finally block should still run
  });
});
