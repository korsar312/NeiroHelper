import DI from "./DI";
import { ProjectInterface } from "./Project.interface";
import LinksImp from "../Infrastructure/InfrastructureLinks/Imp/Links.imp";
import { InfrastructureLinks } from "../Infrastructure/InfrastructureLinks";
import FilesImp from "../Infrastructure/InfrastructureFiles/Imp/Files.imp";
import { InfrastructureFiles } from "../Infrastructure/InfrastructureFiles";
import DbImp from "../Infrastructure/InfrastructureDb/Imp/Db.imp";
import { InfrastructureDb } from "../Infrastructure/InfrastructureDb";

const linksImps = new LinksImp();
const links = new InfrastructureLinks(linksImps);

const FilesImps = new FilesImp();
const Files = new InfrastructureFiles(FilesImps);

const DBImps = new DbImp();
const DB = new InfrastructureDb(DBImps);

const Infrastructure = new DI<ProjectInterface.TModuleInf>();

Infrastructure.use("Links", links);
Infrastructure.use("Files", Files);
Infrastructure.use("DB", DB);

export default Infrastructure;
