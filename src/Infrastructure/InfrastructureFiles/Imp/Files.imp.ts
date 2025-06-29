import { FilesInterface } from "../Files.interface";

class FilesImp implements FilesInterface.IAdapter {
	private readonly connect: FilesInterface.IAdapter;

	constructor(Connection: FilesInterface.IAdapter) {
		this.connect = Connection;
	}

	get readFile() {
		return this.connect.readFile.bind(this.connect);
	}

	get addToFile() {
		return this.connect.addToFile.bind(this.connect);
	}

	get createFile() {
		return this.connect.createFile.bind(this.connect);
	}
}

export default FilesImp;
