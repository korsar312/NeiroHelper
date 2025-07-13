import { HistoryInterface } from "../History.interface";
import { ProjectInterface } from "../../../DI/Project.interface";

class HistoryImp implements HistoryInterface.IAdapter {
	protected Infrastructure: ProjectInterface.TInfrastructure;

	constructor(Infrastructure: ProjectInterface.TInfrastructure) {
		this.Infrastructure = Infrastructure;
	}

	public async clearHistory(id: number) {
		this.Infrastructure("DB").invoke.delete.history(id);
	}

	public async setHistory(id: number, idMessage: number, question: string, answer: string) {
		this.Infrastructure("DB").invoke.create.history(id, idMessage, question, answer);
	}

	public async getHistory(id: number, last: number) {
		const history = this.Infrastructure("DB").invoke.read.history(id, last);

		return history.map((el) => ({ question: el.question, answer: el.answer })).reverse();
	}
}

export default HistoryImp;
