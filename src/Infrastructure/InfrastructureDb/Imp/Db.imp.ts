import { DbInterface } from "../Db.interface";

class DbImp implements DbInterface.IAdapter {
	constructor(private connection: DbInterface.IAdapter) {}

	get read() {
		return this.connection.read;
	}

	get create() {
		return this.connection.create;
	}

	get update() {
		return this.connection.update;
	}

	get delete() {
		return this.connection.delete;
	}

	get readAll() {
		return this.connection.readAll;
	}
}

export default DbImp;
