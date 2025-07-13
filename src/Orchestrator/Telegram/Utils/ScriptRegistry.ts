import { OrchestratorTelegramInterface } from "../OrchestratorTelegram.interface";
import { DirectiveBase } from "../DirectiveBase";
import modules from "../../../DI";

const registry = new Map<string, DirectiveBase>();

export function RegisterDirective(command: OrchestratorTelegramInterface.EDirective) {
	return function (target: new (params: OrchestratorTelegramInterface.TDirective) => DirectiveBase) {
		registry.set(command, new target(modules));
	};
}

export function getDirective(command: string): DirectiveBase | null {
	return registry.get(command) || null;
}
