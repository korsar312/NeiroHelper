import { HistoryInterface } from "../History.interface";
import { ProjectInterface } from "../../../DI/Project.interface";

class HistoryImpTest implements HistoryInterface.IAdapter {
	protected Infrastructure: ProjectInterface.TDIInfrastructure;

	constructor(Infrastructure: ProjectInterface.TDIInfrastructure) {
		this.Infrastructure = Infrastructure;
	}

	public async clearHistory(id: number) {
		if (Math.round(Math.random())) throw "clearHistory";
	}

	public async setHistory(id: number, idMessage: number, question: string, answer: string) {
		if (Math.round(Math.random())) throw "setHistory";
	}

	public async getHistory(id: number, last: number) {
		if (Math.round(Math.random())) throw "getHistory";

		return [];
	}
}

export default HistoryImpTest;
