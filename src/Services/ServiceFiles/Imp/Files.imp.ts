import { ConnectInterface } from "../Connect/Connect.Interface";
import { FilesInterface } from "../Files.interface";
import { ProjectInterface } from "../../../DI/Project.interface";

class FilesImp implements FilesInterface.IAdapter {
	private readonly connect: ConnectInterface.BaseClass;
	protected Infrastructure: ProjectInterface.TInfrastructure;

	constructor(Connection: ConnectInterface.BaseClass, Infrastructure: ProjectInterface.TInfrastructure) {
		this.connect = Connection;
		this.Infrastructure = Infrastructure;
	}

	public addToLearn(text: string) {
		return this.connect.addToFile(ConnectInterface.EFilePath.LEARN, text);
	}

	public addToDialog(userId: string, text: string) {
		return this.connect.addToFile(ConnectInterface.EFilePath.HISTORY_DIALOG(userId), text);
	}

	public getAuth() {
		return this.connect.readNdJson<Array<number> | number>(ConnectInterface.EFilePath.AUTH);
	}

	public setAuth(text: string) {
		return this.connect.addToFile(ConnectInterface.EFilePath.AUTH, text);
	}

	public getInstruction() {
		return this.connect.readTxt<{ instruction: string }>(ConnectInterface.EFilePath.INSTRUCTION);
	}

	public setInstruction() {
		return this.connect.addToFile(ConnectInterface.EFilePath.INSTRUCTION, "");
	}
}

export default FilesImp;
