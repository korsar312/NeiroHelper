import Orchestrator from "./Orchestrator/Orchestrator";
import OrchestratorTelegram from "./Orchestrator/Telegram/OrchestratorTelegram";
import service from "./DI/Create.services";
import Infrastructure from "./DI/Create.infrastructure";

export function start() {
	const DIInfrastructure = Infrastructure;
	const DIService = service;

	const orchestrator = new Orchestrator(DIInfrastructure.get, DIService.get);

	orchestrator.use(OrchestratorTelegram);
	orchestrator.start();
}

start();
