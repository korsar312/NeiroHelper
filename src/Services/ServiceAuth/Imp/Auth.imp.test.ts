import { AuthInterface } from "../Auth.interface";
import { ProjectInterface } from "../../../DI/Project.interface";
import { OrchestratorTelegramInterface } from "../../../Orchestrator/Telegram/OrchestratorTelegram.interface";

class AuthImpTest implements AuthInterface.IAdapter {
	protected Infrastructure: ProjectInterface.TDIInfrastructure;

	constructor(Infrastructure: ProjectInterface.TDIInfrastructure) {
		this.Infrastructure = Infrastructure;
	}

	public isAuthUser(userId: number, command: OrchestratorTelegramInterface.EDirective) {
		if (Math.round(Math.random())) throw "isAuthUser";

		return true;
	}

	setUserGrade(userId: number, grade: AuthInterface.EGrade, date?: string) {
		if (Math.round(Math.random())) throw "setUserGrade";
	}

	getAllUser() {
		if (Math.round(Math.random())) throw "getAllUser";

		return [];
	}

	removeUser(userId: number) {
		if (Math.round(Math.random())) throw "removeUser";
	}
}

export default AuthImpTest;
