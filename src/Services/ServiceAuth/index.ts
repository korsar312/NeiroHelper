import ServiceBase from "../Service.base";
import { AuthInterface } from "./Auth.interface";

export class ServiceAuth extends ServiceBase<AuthInterface.IAdapter> {}
