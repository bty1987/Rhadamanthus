/**
 * @File Name		: ActionLogRecorder.java
 * @Package 		: com.fanglin.log.recorder
 * @Version			: 1.0
 * @Date			: 2026-07-20
 * @Copyright		: Copyright Creators
 * @Describing		: 操作日志落库辅助类，供 AccessInterceptor 在请求结束时调用
 *
 *  职责边界：
 *    - 只负责"采集 + 组装 + 委托 LogService 写库"，本身不含业务逻辑
 *    - 不读取 SystemConfig 开关（开关在 LogService.safeAddActionLog 内部判定，
 *      这样开关关闭时连 PO 组装都不做——本类的 record 方法会先查开关）
 *    - 异常全部吞掉，由 safeAddActionLog 二次兜底
 *
 *  设计说明：
 *    原 AccessInterceptor 已经在每个请求里拿到了 userId/actionName/ip/company/
 *    runTime/errorCode/errorMsg 这些信息（用于 LogUtils.logging 打文件），
 *    本类的工作只是把这些既有信息组装成 ActionLogPO 并写库，避免 AccessInterceptor
 *    代码膨胀。
 */

package com.fanglin.log.recorder;

import java.util.Date;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fanglin.core.security.AESHelper;
import com.fanglin.core.vo.Authentication;
import com.fanglin.log.context.ActionLogContext;
import com.fanglin.log.po.ActionLogPO;
import com.fanglin.log.service.LogService;
import com.fanglin.log.utils.ParamSanitizer;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.system.po.OperationPO;
import com.fanglin.utils.Constant;
import com.fanglin.utils.CookieUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.SystemConfig;
import com.fanglin.utils.UUIDUtil;

public class ActionLogRecorder {

	private static final Logger logger = LoggerFactory.getLogger(ActionLogRecorder.class);

	private final LogService logService;
	private final UserDao userDao;

	public ActionLogRecorder(LogService logService, UserDao userDao) {
		this.logService = logService;
		this.userDao = userDao;
	}

	/**
	 * 采集并落库一条操作日志。
	 * 
	 * <p>
	 * 本方法必须在 AccessInterceptor 的请求处理"之后"调用（即 Action 已执行完毕， errorCode/errorMsg 已写入 ValueStack）。它负责：
	 * <ol>
	 * <li>组装 ActionLogPO（含 userId/ip/action/runTime/module/businessId/...）；</li>
	 * <li>调用 LogService.safeAddActionLog 异步独立事务写库；</li>
	 * <li>清理 ActionLogContext ThreadLocal；</li>
	 * <li>吞掉所有异常。</li>
	 * </ol>
	 * 
	 * @param request 当前 servlet 请求
	 * @param actionName Action 路由名（如 "pageDecoration"）
	 * @param authentication 解密后的 Authentication（含 userId/company），可能为 null（未登录请求）
	 * @param startTime 请求开始时间戳
	 * @param endTime 请求结束时间戳
	 * @param errorCode ValueStack 中的 errorCode（null 表示无错误）
	 * @param errorMsg ValueStack 中的 errorMsg
	 * @param exception 拦截器捕获的异常（用于区分 fail/error）
	 * @param logFlag operation.logFlag（0=NONE 1=ALWAYS 2=AUTO），null 视为 AUTO
	 */
	public void record(HttpServletRequest request, String actionName, Authentication authentication, long startTime, long endTime, Object errorCode, Object errorMsg, Throwable exception, Short logFlag) {

		// 先清理 ThreadLocal（即便下面失败也要清，避免泄漏）
		ActionLogContext.Holder ctx = ActionLogContext.current();
		try {
			// 优先级 1：全局总开关（紧急熔断用）
			if (!SystemConfig.getBoolean("actionLog.enable", true)) return;

			// logFlag 为 null 时兜底为 AUTO（operation 查不到/未登记的情况）
			short flag = logFlag != null ? logFlag : OperationPO.LOGFLAG_AUTO_INT;

			// 优先级 2：NONE 和 AUTO 都不自动记录
			// NONE(0) = 明确不记录（运维主动关闭某接口的日志）
			// AUTO(2) = 默认不记录（存量 operation 默认值，只有业务侧 bind 才记录）
			// 只有 ALWAYS(1) 才无条件记录
			if (flag != OperationPO.LOGFLAG_ALWAYS_INT) {
				// 例外：业务侧通过 ActionLogContext.bind 明确绑定的，即使 AUTO/NONE 也强制记录
				// 注意：AccessInterceptor 在请求开始时调了 begin()，ctx 永远不为 null（是空 Holder），
				// 所以必须判断 ctx 是否真正 bind 了数据（module/businessId/operateType 任一非空），
				// 否则所有 AUTO 接口都会因为 ctx != null 被误记录
				if (!isBound(ctx)) return;
			}

			ActionLogPO po = buildPO(request, actionName, authentication, startTime, endTime, errorCode, errorMsg, exception, ctx);
			if (po == null) return;

			logService.safeAddActionLog(po);
		} catch (Throwable t) {
			logger.error("[actionLog] recorder exception action={}", actionName, t);
		} finally {
			ActionLogContext.clear();
		}
	}

	/**
	 * 判断业务侧是否通过 ActionLogContext.bind 真正绑定了数据。
	 * 
	 * <p>
	 * AccessInterceptor 在请求开始时调了 begin()，ThreadLocal 里的 Holder 一定存在 （但所有字段为 null）。只有业务侧调过 bind 才会填充字段。本方法用于区分 "空 Holder"（业务侧没 bind）和"有数据的 Holder"（业务侧主动审计）。
	 * 
	 * <p>
	 * 判断标准：module/businessId/operateType 任一非 null 即视为已绑定。
	 */
	private boolean isBound(ActionLogContext.Holder ctx) {
		if (ctx == null) return false;
		return ctx.getModule() != null || ctx.getBusinessId() != null || ctx.getOperateType() != null;
	}

	/**
	 * 判断是否 QUERY 类只读操作（已弃用，保留供未来按需启用）。
	 * 
	 * <p>
	 * 历史：Phase 4.1 引入用于 AUTO 模式跳过 QUERY 类。 当前：AUTO 模式语义改为"不记录"，QUERY 类无需特殊判断。 保留方法供未来如需"按操作类型精细过滤"时复用。
	 */
	@SuppressWarnings("unused")
	private boolean isQueryAction(String actionName) {
		if (actionName == null) return false;
		String lower = actionName.toLowerCase();
		return lower.startsWith("page") || lower.startsWith("query") || lower.startsWith("get") || lower.startsWith("count") || lower.startsWith("amount") || lower.startsWith("list") || lower.startsWith("check") || lower.startsWith("show") || lower.startsWith("view") || lower.startsWith("read") || lower.startsWith("fetch") || lower.startsWith("find") || lower.startsWith("verify") || lower.startsWith("search") || lower.startsWith("has") || lower.startsWith("exist") || lower.startsWith("is");
	}

	/** 已知业务模块字典（小写），用于从 actionName 反查 moduleId。 */
	private static final String[] KNOWN_MODULES = { "decoration", "quotation", "construction", "customer", "balance", "payment", "material", "sales", "personel", "system", "approval", "information", "communion", "production", "inventory", "salary", "building", "store", "market", "report", "finance", "kingdee", "data" };

	/** 已知 CRUD + 业务动词前缀（小写），用于从 actionName 切除前缀得到对象段。 */
	private static final String[] KNOWN_VERBS = { "page", "query", "add", "update", "delete", "cancel", "submit", "confirm", "approve", "affirm", "export", "import", "get", "count", "amount", "enable", "disable", "make", "send", "finish", "create", "change", "handle", "lock", "unlock", "bind", "unbind", "sign", "refund", "reject", "receive", "copy", "discount", "close", "reset", "adopt", "agree", "check", "show", "view", "read", "fetch", "find", "verify", "search", "begin", "end", "affix", "abate", "delive", "compute", "stat", "login", "logout", "dogin", "down", "upload" };

	/**
	 * 从 request 解析 authentication（兜底，与 BaseAction.authentication() 一致）。
	 *
	 * <p>
	 * 查找顺序：parameter → cookie → attribute。AES 解密可能抛异常（密文非法/未传），
	 * recorder 作为日志组件必须吞掉异常不影响主流程，故本方法内部 try-catch 是必要的，
	 * 与业务 Action 层"禁止本地 try-catch"规范不冲突。
	 *
	 * @return 解析出的 Authentication；匿名/回调类请求或解密失败时返回 null
	 */
	private Authentication resolveAuthentication(HttpServletRequest request) {

		if (request == null) return null;

		try {
			String auth = request.getParameter("authentication");
			if (auth == null) {
				auth = CookieUtil.getCookie(request, Constant.COOKIE_AUTHENTICATION);
			}
			if (auth == null) {
				auth = (String) request.getAttribute("authentication");
			}
			if (auth == null || auth.length() == 0) return null;

			String decryptString = AESHelper.decrypt(auth, SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv"));
			if (decryptString == null || decryptString.length() == 0) return null;

			return new Authentication(decryptString);
		} catch (Throwable t) {
			return null;
		}
	}

	private ActionLogPO buildPO(HttpServletRequest request, String actionName, Authentication authentication, long startTime, long endTime, Object errorCode, Object errorMsg, Throwable exception, ActionLogContext.Holder ctx) {

		ActionLogPO po = new ActionLogPO();
		po.setActionName(actionName);
		po.setCreateTime(DateUtil.getDateToTimestamp(new Date(endTime)));
		po.setRunTime(endTime - startTime);
		po.setTraceId(UUIDUtil.getUuid());

		// 用户与公司
		// 拦截器透传的 authentication 可能为 null（如 operation.through=PASS 通道不做认证），
		// 此时从 request 兜底解析（与 BaseAction.authentication() 一致：parameter→cookie→attribute），
		// 让 PASS 通道的业务接口也能记录操作人。解析失败（匿名/回调类请求）返回 null，createUserPO 留空。
		if (authentication == null) {
			authentication = resolveAuthentication(request);
		}

		String userId = null;
		Integer company = null;
		if (authentication != null && authentication.getUserId() != null) {
			userId = authentication.getUserId();
			company = authentication.getCompany();
			try {
				UserPO userPO = userDao.queryUserByUserId(userId);
				po.setCreateUserPO(userPO);
			} catch (Throwable t) {
				logger.warn("[actionLog] load user failed userId={}", userId, t);
			}
		}
		po.setCompanyId(company);

		// IP
		if (request != null) {
			try {
				po.setIp(com.fanglin.utils.IPUtil.getIpAddr(request));
			} catch (Throwable ignore) {
			}
		}

		// 业务侧绑定的 module/businessId/operateType
		if (ctx != null) {
			po.setModuleId(ctx.getModule());
			po.setBusinessId(ctx.getBusinessId());
			po.setOperateType(ctx.getOperateType());
		}
		// 模块兜底：从 actionName 前缀推断（如 pageDecoration -> decoration）
		if (po.getModuleId() == null && actionName != null) {
			po.setModuleId(inferModule(actionName));
		}
		// 操作类型兜底：从 actionName 前缀推断
		if (po.getOperateType() == null && actionName != null) {
			po.setOperateType(inferOperateType(actionName));
		}

		// 结果状态
		if (exception != null) {
			// 系统异常（非 FLException）
			po.setResultState(ActionLogPO.RESULTSTATE_ERROR);
		} else if (errorCode != null) {
			po.setResultState(ActionLogPO.RESULTSTATE_FAIL);
		} else {
			po.setResultState(ActionLogPO.RESULTSTATE_SUCCESS);
		}

		// 错误码与消息（成功时为 null）
		if (errorCode != null) {
			try {
				po.setErrorCode(Integer.valueOf(errorCode.toString()));
			} catch (NumberFormatException ignore) {
			}
		}
		if (errorMsg != null) {
			String msg = errorMsg.toString();
			po.setErrorMsg(msg.length() > 255 ? msg.substring(0, 255) : msg);
		}

		// 请求参数（脱敏后）
		int maxLen = SystemConfig.getInt("actionLog.maxParamLen", ParamSanitizer.DEFAULT_MAX_LEN);
		po.setParams(ParamSanitizer.sanitize(request, maxLen));

		return po;
	}

	/**
	 * 从 actionName 推断模块名（兜底逻辑，P1-4 改造）。
	 * 
	 * <p>
	 * 原实现按动词前缀切第一个驼峰段，对 updateDecorationForPayScale 这种 多段驼峰会返回 decoratitionforpayscale，导致前端模块筛选失效。
	 * 
	 * <p>
	 * 新实现用"模块字典反查"：先切除已知动词前缀，再在剩余字符串里 查找已知模块名（KNOWN_MODULES），返回最长匹配。例如：
	 * <ul>
	 * <li>pageDecoration → 切除 page → 剩余 Decoration → 匹配 decoration</li>
	 * <li>updateDecorationForPayScale → 切除 update → 剩余 DecorationForPayScale → 匹配 decoration</li>
	 * <li>addCustomerPhone → 切除 add → 剩余 CustomerPhone → 匹配 customer</li>
	 * </ul>
	 */
	private String inferModule(String actionName) {
		if (actionName == null || actionName.length() == 0) return null;

		String lower = actionName.toLowerCase();
		String residual = actionName;

		// 第一步：切除已知动词前缀（最长匹配，避免 addCustomer 里 add 误切）
		String matchedVerb = null;
		for (String v : KNOWN_VERBS) {
			if (lower.startsWith(v) && actionName.length() > v.length()) {
				char next = actionName.charAt(v.length());
				if (next >= 'A' && next <= 'Z') {
					if (matchedVerb == null || v.length() > matchedVerb.length()) {
						matchedVerb = v;
					}
				}
			}
		}
		if (matchedVerb != null) {
			residual = actionName.substring(matchedVerb.length());
		}

		// 第二步：在剩余字符串里查找已知模块名（最长匹配优先）
		String residualLower = residual.toLowerCase();
		String bestMatch = null;
		for (String module : KNOWN_MODULES) {
			if (residualLower.startsWith(module.toLowerCase())) {
				if (bestMatch == null || module.length() > bestMatch.length()) {
					bestMatch = module;
				}
			}
		}
		return bestMatch;
	}

	/**
	 * 从 actionName 推断操作类型（兜底逻辑，P1-4 扩展）。
	 * 
	 * <p>
	 * 覆盖项目 METHOD_NAMING_CONVENTION.md 里的所有动词分类， 映射到 ActionLogPO.operateType 的标准枚举（ADD/UPDATE/DELETE/QUERY/EXPORT/LOGIN/OTHER）。
	 */
	private String inferOperateType(String actionName) {
		if (actionName == null) return null;
		String lower = actionName.toLowerCase();

		// ADD：新增类
		if (lower.startsWith("add") || lower.startsWith("create") || lower.startsWith("save") || lower.startsWith("make") || lower.startsWith("send") || lower.startsWith("copy") || lower.startsWith("affix") || lower.startsWith("bind")) return "ADD";

		// UPDATE：修改类
		if (lower.startsWith("update") || lower.startsWith("edit") || lower.startsWith("modify") || lower.startsWith("change") || lower.startsWith("handle") || lower.startsWith("reset") || lower.startsWith("adopt") || lower.startsWith("agree") || lower.startsWith("confirm") || lower.startsWith("approve") || lower.startsWith("affirm") || lower.startsWith("submit") || lower.startsWith("sign") || lower.startsWith("finish") || lower.startsWith("begin") || lower.startsWith("end") || lower.startsWith("enable") || lower.startsWith("disable") || lower.startsWith("lock") || lower.startsWith("unlock") || lower.startsWith("discount") || lower.startsWith("abate") || lower.startsWith("close")) return "UPDATE";

		// DELETE：删除类
		if (lower.startsWith("delete") || lower.startsWith("remove") || lower.startsWith("unbind")) return "DELETE";

		// EXPORT/IMPORT
		if (lower.startsWith("export") || lower.startsWith("download")) return "EXPORT";
		if (lower.startsWith("import") || lower.startsWith("upload")) return "IMPORT";

		// QUERY：查询类（与 isQueryAction 保持一致）
		if (lower.startsWith("page") || lower.startsWith("query") || lower.startsWith("get") || lower.startsWith("count") || lower.startsWith("amount") || lower.startsWith("list") || lower.startsWith("check") || lower.startsWith("show") || lower.startsWith("view") || lower.startsWith("read") || lower.startsWith("fetch") || lower.startsWith("find") || lower.startsWith("verify") || lower.startsWith("search") || lower.startsWith("has") || lower.startsWith("exist") || lower.startsWith("is")) return "QUERY";

		// LOGIN
		if (lower.startsWith("login") || lower.startsWith("logout") || lower.startsWith("dogin")) return "LOGIN";

		// 业务动作（cancel/reject/receive/refund/delive）归类为 OTHER
		return "OTHER";
	}

}
