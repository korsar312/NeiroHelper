import OrchestratorBase from "./OrchestratorBase";
import { ProjectInterface } from "../DI/Project.interface";

class Orchestrator extends OrchestratorBase {
	private readonly platforms: OrchestratorBase[] = [];

	public use(Platform: new (module: ProjectInterface.TDIModules) => OrchestratorBase) {
		this.platforms.push(new Platform(this.modules));
	}

	public async invoke() {
		for (const platform of this.platforms) platform.invoke();
	}
}

export default Orchestrator;
