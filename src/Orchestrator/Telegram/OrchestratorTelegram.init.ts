import { OrchestratorTelegramInterface } from "./OrchestratorTelegram.interface";
import { Directive } from "../../index";
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

{
	@Directive.register(OrchestratorTelegramInterface.EDirective.ADD_AUTH)
	class directive extends AddAuth {}
}
{
	@Directive.register(OrchestratorTelegramInterface.EDirective.CASH_OUT)
	class directive extends CashOut {}
}
{
	@Directive.register(OrchestratorTelegramInterface.EDirective.CLEAR)
	class directive extends Clear {}
}
{
	@Directive.register(OrchestratorTelegramInterface.EDirective.DEL_AUTH)
	class directive extends DeleteAuth {}
}
{
	@Directive.register(OrchestratorTelegramInterface.EDirective.GET_BALANCE)
	class directive extends GetBalance {}
}
{
	@Directive.register(OrchestratorTelegramInterface.EDirective.GET_ALL_USER)
	class directive extends GetUserList {}
}
{
	@Directive.register(OrchestratorTelegramInterface.EDirective.LEARN)
	class directive extends Learn {}
}
{
	@Directive.register(OrchestratorTelegramInterface.EDirective.NO_AUTH)
	class directive extends NoAuth {}
}
{
	@Directive.register(OrchestratorTelegramInterface.EDirective.PAY)
	class directive extends Pay {}
}
{
	@Directive.register(OrchestratorTelegramInterface.EDirective.SAY)
	class directive extends Say {}
}
{
	@Directive.register(OrchestratorTelegramInterface.EDirective.SEND_MASSAGE)
	class directive extends SendMgs {}
}
{
	@Directive.register(OrchestratorTelegramInterface.EDirective.START)
	class directive extends Start {}
}
{
	@Directive.register(OrchestratorTelegramInterface.EDirective.TRANSFER)
	class directive extends Trans {}
}
