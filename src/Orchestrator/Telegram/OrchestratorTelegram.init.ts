import "./Directives/Learn";
import "./Directives/Say";
import "./Directives/NoAuth";
import "./Directives/Clear";
import "./Directives/Pay";
import "./Directives/DeleteAuth";
import "./Directives/AddAuth";
import "./Directives/GetUserList";
import "./Directives/GetBalance";
import "./Directives/Start";
import "./Directives/SendMgs";
import "./Directives/CashOut";
import "./Directives/Trans";
import { AddAuth } from "./Directives/AddAuth";
import { CashOut } from "./Directives/CashOut";
import { Clear } from "./Directives/Clear";
import { DeleteAuth } from "./Directives/DeleteAuth";
import { GetBalance } from "./Directives/GetBalance";
import { GetUserList } from "./Directives/GetUserList";
import { Learn } from "./Directives/Learn";
import { NoAuth } from "./Directives/NoAuth";
import { Pay } from "./Directives/Pay";
import { Say } from "./Directives/Say";
import { SendMgs } from "./Directives/SendMgs";
import { Start } from "./Directives/Start";
import { Trans } from "./Directives/Trans";
import { RegisterDirective } from "./Utils/ScriptRegistry";
import { OrchestratorTelegramInterface } from "./OrchestratorTelegram.interface";

{
	@RegisterDirective(OrchestratorTelegramInterface.EDirective.ADD_AUTH)
	class directive extends AddAuth {}
}
{
	@RegisterDirective(OrchestratorTelegramInterface.EDirective.CASH_OUT)
	class directive extends CashOut {}
}
{
	@RegisterDirective(OrchestratorTelegramInterface.EDirective.CLEAR)
	class directive extends Clear {}
}
{
	@RegisterDirective(OrchestratorTelegramInterface.EDirective.DEL_AUTH)
	class directive extends DeleteAuth {}
}
{
	@RegisterDirective(OrchestratorTelegramInterface.EDirective.GET_BALANCE)
	class directive extends GetBalance {}
}
{
	@RegisterDirective(OrchestratorTelegramInterface.EDirective.GET_ALL_USER)
	class directive extends GetUserList {}
}
{
	@RegisterDirective(OrchestratorTelegramInterface.EDirective.LEARN)
	class directive extends Learn {}
}
{
	@RegisterDirective(OrchestratorTelegramInterface.EDirective.NO_AUTH)
	class directive extends NoAuth {}
}
{
	@RegisterDirective(OrchestratorTelegramInterface.EDirective.PAY)
	class directive extends Pay {}
}
{
	@RegisterDirective(OrchestratorTelegramInterface.EDirective.SAY)
	class directive extends Say {}
}
{
	@RegisterDirective(OrchestratorTelegramInterface.EDirective.SEND_MASSAGE)
	class directive extends SendMgs {}
}
{
	@RegisterDirective(OrchestratorTelegramInterface.EDirective.START)
	class directive extends Start {}
}
{
	@RegisterDirective(OrchestratorTelegramInterface.EDirective.TRANSFER)
	class directive extends Trans {}
}
