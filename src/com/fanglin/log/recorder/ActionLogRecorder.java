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

import java.sql.Timestamp;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fanglin.core.vo.Authentication;
import com.fanglin.log.context.ActionLogContext;
import com.fanglin.log.po.ActionLogPO;
import com.fanglin.system.po.OperationPO;
import com.fanglin.log.service.LogService;
import com.fanglin.log.utils.ParamSanitizer;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.SystemConfig;
import com.fanglin.utils.UUIDUtil;

public class ActionLogRecorder {

	private static final Logger logger = LoggerFactory.getLogger(ActionLogRecorder.class);

	private final LogService logService;
	private final UserDao userDao;

	public ActionLogRecorder(LogService logService, UserDao userDao){
		this.logService = logService;
		this.userDao = userDao;
	}

	/**
	 * 采集并落库一条操作日志。
	 *
	 * <p>本方法必须在 AccessInterceptor 的请求处理"之后"调用（即 Action 已执行完毕，
	 * errorCode/errorMsg 已写入 ValueStack）。它负责：
	 * <ol>
	 *   <li>组装 ActionLogPO（含 userId/ip/action/runTime/module/businessId/...）；</li>
	 *   <li>调用 LogService.safeAddActionLog 异步独立事务写库；</li>
	 *   <li>清理 ActionLogContext ThreadLocal；</li>
	 *   <li>吞掉所有异常。</li>
	 * </ol>
	 *
	 * @param request       当前 servlet 请求
	 * @param actionName    Action 路由名（如 "pageDecoration"）
	 * @param authentication 解密后的 Authentication（含 userId/company），可能为 null（未登录请求）
	 * @param startTime     请求开始时间戳
	 * @param endTime       请求结束时间戳
	 * @param errorCode     ValueStack 中的 errorCode（null 表示无错误）
	 * @param errorMsg      ValueStack 中的 errorMsg
	 * @param exception     拦截器捕获的异常（用于区分 fail/error）
	 * @param logFlag       operation.logFlag（0=NONE 1=ALWAYS 2=AUTO），null 视为 AUTO
	 */
	public void record(HttpServletRequest request, String actionName, Authentication authentication,
			long startTime, long endTime, Object errorCode, Object errorMsg, Throwable exception, Short logFlag){

		// 先清理 ThreadLocal（即便下面失败也要清，避免泄漏）
		ActionLogContext.Holder ctx = ActionLogContext.current();
		try {
			// 优先级 1：全局总开关（紧急熔断用）
			if (!SystemConfig.getBoolean("actionLog.enable", true)) return;

			// logFlag 为 null 时兜底为 AUTO（operation 查不到/未登记的情况）
			short flag = logFlag != null ? logFlag : OperationPO.LOGFLAG_AUTO_INT;

			// 优先级 2：NONE 绝对不记录（即使业务侧主动绑定也不记录）
			if (flag == OperationPO.LOGFLAG_NONE_INT) return;

			// 优先级 3：ALWAYS 始终记录（覆盖 AUTO 的 QUERY 过滤）
			if (flag == OperationPO.LOGFLAG_ALWAYS_INT) {
				ActionLogPO po = buildPO(request, actionName, authentication, startTime, endTime, errorCode, errorMsg, exception, ctx);
				if (po == null) return;
				logService.safeAddActionLog(po);
				return;
			}

			// 优先级 4+5+6：AUTO 模式（flag == LOGFLAG_AUTO_INT）
			// QUERY 类只读操作默认不写库（数据量控制），由 actionLog.skipQuery 全局开关控制
			// 豁免：业务侧通过 ActionLogContext.bind 明确绑定的，即使 QUERY 类也强制写
			// 如需精确控制单个接口，请改 operation.logFlag 为 NONE 或 ALWAYS
			if (ctx == null && SystemConfig.getBoolean("actionLog.skipQuery", true) && isQueryAction(actionName)){
				return;
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
	 * 判断是否 QUERY 类只读操作（pageXXX / queryXXX / getXXX / countXXX / amountXXX / listXXX）。
	 *
	 * <p>Phase 4.1 引入：这类操作审计价值低但调用量占 80%+，默认不写库，
	 * 数据量从 ~7300 万/年降到 ~730 万/年。判断依据 actionName 前缀，
	 * 与 inferOperateType 保持一致。
	 */
	private boolean isQueryAction(String actionName){
		if (actionName == null) return false;
		String lower = actionName.toLowerCase();
		return lower.startsWith("page") || lower.startsWith("query") || lower.startsWith("get")
				|| lower.startsWith("count") || lower.startsWith("amount") || lower.startsWith("list");
	}

	private ActionLogPO buildPO(HttpServletRequest request, String actionName, Authentication authentication,
			long startTime, long endTime, Object errorCode, Object errorMsg, Throwable exception,
			ActionLogContext.Holder ctx){

		ActionLogPO po = new ActionLogPO();
		po.setActionName(actionName);
		po.setCreateTime(DateUtil.getDateToTimestamp(new Date(endTime)));
		po.setRunTime(endTime - startTime);
		po.setTraceId(UUIDUtil.getUuid());

		// 用户与公司
		String userId = null;
		Integer company = null;
		if (authentication != null && authentication.getUserId() != null){
			userId = authentication.getUserId();
			company = authentication.getCompany();
			try {
				UserPO userPO = userDao.queryUserByUserId(userId);
				po.setCreateUserPO(userPO);
			} catch (Throwable t) {
				logger.warn("[actionLog] load user failed userId={}", userId, t);
			}
		} else {
			// 未登录或匿名请求，createUserPO 保留 null（DB 列允许 NULL）
		}
		po.setCompanyId(company);

		// IP
		if (request != null){
			try {
				po.setIp(com.fanglin.utils.IPUtil.getIpAddr(request));
			} catch (Throwable ignore) { }
		}

		// 业务侧绑定的 module/businessId/operateType
		if (ctx != null){
			po.setModuleId(ctx.getModule());
			po.setBusinessId(ctx.getBusinessId());
			po.setOperateType(ctx.getOperateType());
		}
		// 模块兜底：从 actionName 前缀推断（如 pageDecoration -> decoration）
		if (po.getModuleId() == null && actionName != null){
			po.setModuleId(inferModule(actionName));
		}
		// 操作类型兜底：从 actionName 前缀推断
		if (po.getOperateType() == null && actionName != null){
			po.setOperateType(inferOperateType(actionName));
		}

		// 结果状态
		if (exception != null){
			// 系统异常（非 FLException）
			po.setResultState(ActionLogPO.RESULTSTATE_ERROR);
		} else if (errorCode != null){
			po.setResultState(ActionLogPO.RESULTSTATE_FAIL);
		} else {
			po.setResultState(ActionLogPO.RESULTSTATE_SUCCESS);
		}

		// 错误码与消息（成功时为 null）
		if (errorCode != null){
			try {
				po.setErrorCode(Integer.valueOf(errorCode.toString()));
			} catch (NumberFormatException ignore) { }
		}
		if (errorMsg != null){
			String msg = errorMsg.toString();
			po.setErrorMsg(msg.length() > 255 ? msg.substring(0, 255) : msg);
		}

		// 请求参数（脱敏后）
		int maxLen = SystemConfig.getInt("actionLog.maxParamLen", ParamSanitizer.DEFAULT_MAX_LEN);
		po.setParams(ParamSanitizer.sanitize(request, maxLen));

		return po;
	}

	/**
	 * 从 actionName 推断模块名（兜底逻辑）。
	 * 项目命名约定见 METHOD_NAMING_CONVENTION.md：动词+对象+By条件...
	 * 如 pageDecoration / addCustomer / updateQuotation
	 * 取第一个动词之后的驼峰分段作为模块名。
	 */
	private String inferModule(String actionName){
		if (actionName == null || actionName.length() == 0) return null;

		// 常见动词前缀（与命名规范一致）
		String[] verbs = {"page", "query", "add", "update", "delete", "cancel", "submit", "confirm", "approve", "affirm", "export", "import", "get", "count", "amount", "enable", "disable"};
		String lower = actionName.toLowerCase();
		for (String v : verbs){
			if (lower.startsWith(v) && actionName.length() > v.length()){
				char next = actionName.charAt(v.length());
				if (next >= 'A' && next <= 'Z'){
					// 取动词后到下一个大写或末尾作为模块名
					return actionName.substring(v.length()).toLowerCase();
				}
			}
		}
		return null;
	}

	/**
	 * 从 actionName 推断操作类型（兜底逻辑）。
	 */
	private String inferOperateType(String actionName){
		if (actionName == null) return null;
		String lower = actionName.toLowerCase();
		if (lower.startsWith("add") || lower.startsWith("create") || lower.startsWith("save")) return "ADD";
		if (lower.startsWith("update") || lower.startsWith("edit") || lower.startsWith("modify")) return "UPDATE";
		if (lower.startsWith("delete") || lower.startsWith("remove")) return "DELETE";
		if (lower.startsWith("export")) return "EXPORT";
		if (lower.startsWith("import")) return "IMPORT";
		if (lower.startsWith("page") || lower.startsWith("query") || lower.startsWith("get") || lower.startsWith("count") || lower.startsWith("amount")) return "QUERY";
		if (lower.startsWith("login") || lower.startsWith("logout") || lower.startsWith("dogin")) return "LOGIN";
		return "OTHER";
	}

}
