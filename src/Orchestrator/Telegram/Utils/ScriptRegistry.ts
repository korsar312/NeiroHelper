import { OrchestratorTelegramInterface } from "../OrchestratorTelegram.interface";
import { DirectiveBase } from "../DirectiveBase";
import { ProjectInterface } from "../../../DI/Project.interface";

export class RegisterDirective {
	private readonly modules: ProjectInterface.TDIModules;
	private registry = new Map<string, DirectiveBase>();

	constructor(modules: ProjectInterface.TDIModules) {
		this.modules = modules;
	}

	public register(command: OrchestratorTelegramInterface.EDirective) {
		return (target: new (params: OrchestratorTelegramInterface.TDirective) => DirectiveBase) => {
			this.registry.set(command, new target(this.modules));
		};
	}

	public getDirective(command: string): DirectiveBase | null {
		return this.registry.get(command) || null;
	}
}
