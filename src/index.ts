import Orchestrator from "./Orchestrator/Orchestrator";
import OrchestratorTelegram from "./Orchestrator/Telegram/OrchestratorTelegram";
import service from "./DI/Create.services";

export function start() {
	const DIService = service;

	const orchestrator = new Orchestrator(DIService.get);

	orchestrator.use(OrchestratorTelegram);
	orchestrator.start();
}
