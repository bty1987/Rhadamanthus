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
	 */
	public void record(HttpServletRequest request, String actionName, Authentication authentication,
			long startTime, long endTime, Object errorCode, Object errorMsg, Throwable exception){

		// 先清理 ThreadLocal（即便下面失败也要清，避免泄漏）
		ActionLogContext.Holder ctx = ActionLogContext.current();
		try {
			// 开关关闭直接返回，不组装 PO
			if (!SystemConfig.getBoolean("actionLog.enable", true)) return;

			ActionLogPO po = buildPO(request, actionName, authentication, startTime, endTime, errorCode, errorMsg, exception, ctx);
			if (po == null) return;

			logService.safeAddActionLog(po);
		} catch (Throwable t) {
			logger.error("[actionLog] recorder exception action={}", actionName, t);
		} finally {
			ActionLogContext.clear();
		}
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
