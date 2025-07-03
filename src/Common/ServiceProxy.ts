import { throwFn } from "../Utils";

class ServiceProxy<T extends object> {
	protected readonly imp: T;
	public readonly invoke: T;

	constructor(implement: T) {
		this.imp = implement;
		this.invoke = this.createInvoker(this.imp);
	}

	private createInvoker<T extends object>(target: T): T {
		return new Proxy({} as T, {
			get: (_, prop: string | symbol) => {
				if (typeof prop === "string" && prop in target) {
					const value = target[prop as keyof T];
					return typeof value === "function" ? value.bind(target) : value;
				}
				throwFn(`${String(prop)} вариант API не существует`);
			},
		});
	}
}

export default ServiceProxy;
