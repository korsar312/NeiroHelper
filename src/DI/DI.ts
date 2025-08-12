import { throwFn } from "../Utils";

class DI<Modules extends Record<string, any>> {
	private registry: { [K in keyof Modules]?: Modules[K] } = {};

	constructor() {
		this.use = this.use.bind(this);
		this.get = this.get.bind(this);
	}

	public use<K extends keyof Modules>(command: K, target: Modules[K]): void {
		this.registry[command] = target;
	}

	public get<K extends keyof Modules>(command: K): Modules[K] {
		const svc = this.registry[command];
		if (!svc) throwFn(`Незарегистрированный сервис ${String(command)}`);
		return svc;
	}
}

export default DI;
