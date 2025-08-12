export namespace OrchestratorInterface {
	export interface IOrchestrator {
		invoke(): Promise<void>;
	}
}
