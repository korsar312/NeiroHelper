import DI from "./DI";
import { ProjectInterface } from "./Project.interface";
import ConnectHTTP from "../Infrastructure/InfrastructureLinks/Connect/HTTP/Connect.HTTP";
import LinksImp from "../Infrastructure/InfrastructureLinks/Imp/Links.imp";
import { InfrastructureLinks } from "../Infrastructure/InfrastructureLinks";
import FilesImp from "../Infrastructure/InfrastructureFiles/Imp/Files.imp";
import { InfrastructureFiles } from "../Infrastructure/InfrastructureFiles";
import DbImp from "../Infrastructure/InfrastructureDb/Imp/Db.imp";
import { ConnectSQLite } from "../Infrastructure/InfrastructureDb/Connect/SQLite/Connect.SQLite";
import { InfrastructureDb } from "../Infrastructure/InfrastructureDb";

const linksConnect = new ConnectHTTP();
const linksImps = new LinksImp(linksConnect);
const links = new InfrastructureLinks(linksImps);

const FilesImps = new FilesImp();
const Files = new InfrastructureFiles(FilesImps);

const DBConnect = new ConnectSQLite();
const DBImps = new DbImp(DBConnect);
const DB = new InfrastructureDb(DBImps);

const Infrastructure = new DI<ProjectInterface.TModuleInf>();

Infrastructure.use("Links", links);
Infrastructure.use("Files", Files);
Infrastructure.use("DB", DB);

export default Infrastructure;
