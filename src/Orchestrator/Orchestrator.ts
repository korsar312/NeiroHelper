import OrchestratorBase from "./OrchestratorBase";
import { ProjectInterface } from "../DI/Project.interface";

class Orchestrator extends OrchestratorBase {
	private readonly platforms: OrchestratorBase[] = [];

	public use<T extends OrchestratorBase, A extends any[]>(Platform: new (modules: ProjectInterface.TDIModules, ...args: A) => T, ...args: A) {
		this.platforms.push(new Platform(this.modules, ...args));
	}

	public async invoke() {
		for (const platform of this.platforms) platform.invoke();
	}
}

export default Orchestrator;
