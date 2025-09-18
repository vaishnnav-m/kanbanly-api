import { controllerMethod } from "../common/ControllerMethod";

export interface IPlanController {
  createPlan: controllerMethod;
  getAllPlans: controllerMethod;
  getPlanById: controllerMethod;
  editPlan: controllerMethod;
}
