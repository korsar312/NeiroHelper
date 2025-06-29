import { ConnectInterface, ConnectInterface as Connect } from "./Connect.Interface";

abstract class ConnectBase implements ConnectInterface.BaseClass {
	protected readonly link: string;
	protected readonly token: string;

	constructor(param: ConnectInterface.ILink) {
		this.link = param.link;
		this.token = param.token;
	}

	abstract request<T>(param: Connect.TRequest): Promise<T>;
}

export default ConnectBase;
