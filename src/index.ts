import Orchestrator from "./Orchestrator/Orchestrator";
import OrchestratorTelegram from "./Orchestrator/Telegram/OrchestratorTelegram";
import modules from "./DI";

export function start() {
	const orchestrator = new Orchestrator(modules);

	orchestrator.use(OrchestratorTelegram);
	orchestrator.invoke();
}

start();
