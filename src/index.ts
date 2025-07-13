import service from "./DI/Create.services";
import Infrastructure from "./DI/Create.infrastructure";
import { RegisterDirective } from "./Orchestrator/Telegram/Utils/ScriptRegistry";
import Orchestrator from "./Orchestrator/Orchestrator";
import OrchestratorTelegram from "./Orchestrator/Telegram/OrchestratorTelegram";
import { ProjectInterface } from "./DI/Project.interface";

const modules: ProjectInterface.TDIModules = {
	services: service.get,
	infrastructure: Infrastructure.get,
};

export const Directive = new RegisterDirective(modules);

function Start() {
	const orchestrator = new Orchestrator(modules);

	orchestrator.use(OrchestratorTelegram, Directive);
	orchestrator.invoke();
}

Start();
