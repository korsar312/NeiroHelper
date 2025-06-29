import { OrchestratorInterface } from "./Orchestrator.interface";
import { ProjectInterface } from "../DI/Project.interface";

abstract class OrchestratorBase implements OrchestratorInterface.IOrchestrator {
	protected module: ProjectInterface.TDIService;

	constructor(module: ProjectInterface.TDIService) {
		this.module = module;
	}

	abstract invoke(): Promise<void>;
}

export default OrchestratorBase;
