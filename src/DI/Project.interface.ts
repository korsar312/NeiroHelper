import { ServiceAuth } from "..//Services/ServiceAuth";
import { ServiceFiles } from "../Services/ServiceFiles";
import { ServiceHistory } from "../Services/ServiceHistory";
import { ServiceInference } from "../Services/ServiceInference";
import { ServiceMessage } from "../Services/ServiceMessage";
import { ServicePayment } from "../Services/ServicePayment";
import { ServiceTelegram } from "../Services/ServiceTelegram";
import { InfrastructureLinks } from "../Infrastructure/InfrastructureLinks";
import { InfrastructureFiles } from "../Infrastructure/InfrastructureFiles";
import { InfrastructureDb } from "../Infrastructure/InfrastructureDb";

export namespace ProjectInterface {
	export type TModuleService = {
		Auth: ServiceAuth;
		Files: ServiceFiles;
		History: ServiceHistory;
		Inference: ServiceInference;
		Message: ServiceMessage;
		Payment: ServicePayment;
		Telegram: ServiceTelegram;
	};

	export type TModuleInf = {
		Files: InfrastructureFiles;
		Links: InfrastructureLinks;
		DB: InfrastructureDb;
	};

	type TDI<M> = <T extends keyof M>(key: T) => M[T];

	export type TServices = TDI<TModuleService>;
	export type TInfrastructure = TDI<TModuleInf>;

	export type TDIModules = {
		services: TServices;
		infrastructure: TInfrastructure;
	};
}
