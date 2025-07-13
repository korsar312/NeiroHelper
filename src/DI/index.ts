import Infrastructure from "./Create.infrastructure";
import service from "./Create.services";
import { ProjectInterface } from "./Project.interface";

export default {
	services: service.get,
	infrastructure: Infrastructure.get,
} satisfies ProjectInterface.TDIModules;
