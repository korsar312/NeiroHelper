import { OrchestratorTelegramInterface } from "../OrchestratorTelegram.interface";

const registry = new Map<string, OrchestratorTelegramInterface.IClass>();

export function RegisterDirective(command: OrchestratorTelegramInterface.EDirective) {
	return function (target: new () => OrchestratorTelegramInterface.IClass) {
		registry.set(command, new target());
	};
}

export function getDirective(command: string): OrchestratorTelegramInterface.IClass | null {
	return registry.get(command) || null;
}
