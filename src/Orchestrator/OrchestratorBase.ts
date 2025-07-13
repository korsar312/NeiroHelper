import { OrchestratorInterface } from "./Orchestrator.interface";
import { ProjectInterface } from "../DI/Project.interface";

abstract class OrchestratorBase implements OrchestratorInterface.IOrchestrator {
	protected modules: ProjectInterface.TDIModules;

	constructor(module: ProjectInterface.TDIModules) {
		this.modules = module;
	}

	abstract invoke(): Promise<void>;
}

export default OrchestratorBase;
