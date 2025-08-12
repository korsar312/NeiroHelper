import InfrastructureBase from "../Infrastructure.base";
import { DbInterface } from "./Db.interface";

export class InfrastructureDb extends InfrastructureBase<DbInterface.IAdapter> {}
