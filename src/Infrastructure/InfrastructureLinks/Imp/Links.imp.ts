import { LinksInterface } from "../Links.interface";

class LinksImp implements LinksInterface.IAdapter {
	private readonly connect: LinksInterface.IAdapter;

	constructor(Connection: LinksInterface.IAdapter) {
		this.connect = Connection;
	}

	public request<T>(params: LinksInterface.IRequest) {
		return this.connect.request<T>(params);
	}
}

export default LinksImp;
