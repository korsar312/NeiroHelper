import OrchestratorBase from "./OrchestratorBase";
import { ProjectInterface } from "../DI/Project.interface";

class Orchestrator {
	private readonly platforms: OrchestratorBase[] = [];
	private readonly module: ProjectInterface.TDIService;

	constructor(module: ProjectInterface.TDIService) {
		this.module = module;
	}

	public use(Platform: new (module: ProjectInterface.TDIService) => OrchestratorBase) {
		this.platforms.push(new Platform(this.module));
	}

	public async start() {
		for (const platform of this.platforms) platform.invoke();
	}
}

export default Orchestrator;
