package com.fanglin.core.interceptor;

import java.sql.Timestamp;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.StrutsStatics;
import org.hibernate.exception.LockAcquisitionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.fanglin.core.security.AESHelper;
import com.fanglin.core.vo.Authentication;
import com.fanglin.core.vo.Duthentication;
import com.fanglin.log.recorder.ActionLogRecorder;
import com.fanglin.log.service.LogService;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.service.UserService;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.system.po.OperationPO;
import com.fanglin.system.service.OperationService;
import com.fanglin.system.service.impl.CompanyServiceImpl;
import com.fanglin.system.vo.OperationVO;
import com.fanglin.utils.Constant;
import com.fanglin.utils.CookieUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.IPUtil;
import com.fanglin.utils.LogUtils;
import com.fanglin.utils.SystemConfig;
import com.opensymphony.xwork2.Action;
import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.AbstractInterceptor;
import com.opensymphony.xwork2.util.ValueStack;

public class AccessInterceptor extends AbstractInterceptor {

	private static final long serialVersionUID = -1754802896214390640L;

	protected Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private OperationService operationService;

	@Autowired
	private UserService userService;

	@Autowired
	private LogService logService;

	@Autowired
	private UserDao userDao;

	/** Phase 1: 操作日志落库辅助类，延迟初始化 */
	private ActionLogRecorder actionLogRecorder;

	@Override
	public String intercept(ActionInvocation invocation) throws Exception {

		ActionContext ctx = invocation.getInvocationContext();
		HttpServletRequest request = (HttpServletRequest) ctx.get(StrutsStatics.HTTP_REQUEST);
		HttpServletResponse response = (HttpServletResponse) ctx.get(StrutsStatics.HTTP_RESPONSE);

		String $authentication = request.getParameter("authentication");

		String userId = "base";
		String actionName = invocation.getProxy().getActionName();
		String ip = IPUtil.getIpAddr(request);

		ValueStack stack = invocation.getStack();

		// Phase 1: 操作日志记录初始化
		long startTime = System.currentTimeMillis();
		Authentication authenticationRef = null; // 解密后的 Authentication 引用，供 recorder 使用
		Throwable caughtException = null;        // 拦截器捕获的异常（用于区分 fail/error）
		// Phase 5: operation.logFlag 引用，用数组包装以便在 try 块内赋值、finally 块内读取
		// （Java 的 final 局部变量约束：lambda/匿名类要求，这里只是普通局部变量也不影响）
		Short[] logFlagHolder = new Short[]{ null };

			try {

				OperationVO operationVO = operationService.checkOperation(new OperationVO(actionName));

				// Phase 5: 把 operation 的 logFlag 记录下来，供 finally 块 recorder 判断用
				// 通过引用捕获（在 finally 块里读取，避免与 operationVO 的作用域冲突）
				logFlagHolder[0] = operationVO != null ? operationVO.getLogFlag() : null;

				if (operationVO.getThrough() != null && operationVO.getThrough() == OperationPO.THROUGH_PASS_INT) {
					invocation.invoke();
				} else if (operationVO.getThrough() != null && operationVO.getThrough() == OperationPO.THROUGH_COMMON_INT) {

					if ($authentication == null) {
						throw new FLException(110005, "登陆超时");
					}

					String decryptString = AESHelper.decrypt($authentication, SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv"));

					if (decryptString == null || "".equals(decryptString)) {
						throw new FLException(-2, "无操作权限");
					}

					Authentication authentication = new Authentication(decryptString);

					if (authentication.getUserId() == null) {

						UserVO userVO = userService.queryUserByUserId(new UserVO(decryptString));

						authentication.setUserId(userVO.getUserId());
						authentication.setCompany(CompanyServiceImpl.decode(userVO.getCompanyNo()));
						authentication.setRoleId(userVO.getRole().getRid());
					}

					if (authentication.getUserId() == null) {
						throw new FLException(-2, "无操作权限");
					}

					authenticationRef = authentication; // Phase 1: 供 recorder 使用

					operationService.fillRoleOperationByOperation(authentication.getUserId(), authentication.getRoleId(), authentication.getCompany(), actionName);

					// if (!operationService.checkOperation(authentication.getUserId(), actionName, (short) 0)) {
					// throw new FLException(-2, "无操作权限");
					// }

					invocation.invoke();

				} else if (request.getHeader("x-ddpaas-signature") != null && operationVO.getThrough() != null && operationVO.getThrough() == OperationPO.THROUGH_DINGTALK_INT) {

					new Duthentication().check(request.getHeader("x-ddpaas-signature"), request.getHeader("x-ddpaas-signature-timestamp"));

					userId = request.getParameter("userId");

					if (userId == null) {
						throw new FLException(110005, "登陆超时");
					}

					UserVO userVO = userService.queryUserByUserId(new UserVO(userId));

					Authentication authentication = new Authentication(userId, userVO.getCurrentName(), userVO.getRole().getRid(), 0l, false, CompanyServiceImpl.decode(userVO.getCompanyNo()), Authentication.TIMEOUT_INT);

					authenticationRef = authentication; // Phase 1: 供 recorder 使用

					request.setAttribute("authentication", AESHelper.encrypt(authentication.getAuthenticationStr(), SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv")));

					invocation.invoke();

				} else {

					if (operationVO.getThrough() != null && operationVO.getThrough() == OperationPO.THROUGH_COMMUNION_INT && SystemConfig.getString("communion") == null) {
						throw new FLException(-1, "无操作权限");
					}

					if ($authentication == null) {
						$authentication = CookieUtil.getCookie(request, Constant.COOKIE_AUTHENTICATION);
					}

					if ($authentication == null) {
						throw new FLException(110005, "登陆超时");
					}

					String decryptString = AESHelper.decrypt($authentication, SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv"));

					if (decryptString == null || "".equals(decryptString)) {
						LogUtils.logging(logger, actionName, 0, "aseerror", ip);
						throw new FLException(110005, "登陆超时");
					}

					Authentication authentication = new Authentication(decryptString);

					authenticationRef = authentication; // Phase 1: 供 recorder 使用

					Timestamp authStartTime = DateUtil.getDateToTimestamp(new Date());

					if (authentication.getUserId() != null) {

						userId = authentication.getUserId();

						LogUtils.logging(logger, authentication.getUserId(), actionName, authentication.getCompany(), ip);

						if (authentication.getUpdateTime() == -1) {
							CookieUtil.delCookie(request, response, Constant.COOKIE_AUTHENTICATION);
							throw new FLException(110005, "登陆超时");
						}

						if (authentication.getTimout() != Authentication.TIMEOUT_INT && authentication.isOverTime(SystemConfig.getInt("cookieOvertime", 30))) {
							throw new FLException(110005, "登陆超时");
						}

						operationService.fillRoleOperationByOperation(authentication.getUserId(), authentication.getRoleId(), authentication.getCompany(), actionName);

						if (operationService.checkOperation(authentication.getUserId(), actionName, authentication.getRollcall())) {
							invocation.invoke();
						} else {
							throw new FLException(-2, "无操作权限");
						}
					} else {
						throw new FLException(110005, "登陆超时");
					}

					Timestamp endTime = DateUtil.getDateToTimestamp(new Date());

					if ((Integer) stack.findValue("errorCode") != null) {

						Long runTime = endTime.getTime() - authStartTime.getTime();

						if (runTime > 5000) {
							LogUtils.logging(logger, actionName, runTime, ip);
						}
					}
				}
			} catch (LockAcquisitionException e) {
				caughtException = e;
				stack.setValue("errorCode", "-2");
				stack.setValue("errorMsg", "数据冲突,请重新再试!");
			} catch (FLException e) {
				caughtException = e;
				stack.setValue("errorCode", e.getCode());
				stack.setValue("errorMsg", e.getErrorMessage());
			} catch (Exception e) {
				caughtException = e;
				stack.setValue("errorCode", "110000");
				stack.setValue("errorMsg", "系统繁忙,请稍后重试");

				LogUtils.logging(logger, e, actionName, userId, ip);
			} finally {
				// Phase 1: 统一记录操作日志（吞异常，不影响主流程）
				try {
					long endTime = System.currentTimeMillis();
					Object errCode = stack.findValue("errorCode");
					Object errMsg = stack.findValue("errorMsg");
					// Phase 5: 把 operation.logFlag 传给 recorder，由它按优先级链判断是否记录
					recorder().record(request, actionName, authenticationRef, startTime, endTime, errCode, errMsg, caughtException, logFlagHolder[0]);
				} catch (Throwable t) {
					logger.error("[actionLog] intercept record failed action={}", actionName, t);
				}
			}

			return Action.SUCCESS;
		}

		/**
		 * 延迟初始化 ActionLogRecorder，避免在构造期触发循环依赖。
		 * recorder 依赖 LogService 与 UserDao，二者均由 @Autowired 注入。
		 */
		private ActionLogRecorder recorder(){
			if (actionLogRecorder == null){
				synchronized (this){
					if (actionLogRecorder == null){
						actionLogRecorder = new ActionLogRecorder(logService, userDao);
					}
				}
			}
			return actionLogRecorder;
		}
	}
