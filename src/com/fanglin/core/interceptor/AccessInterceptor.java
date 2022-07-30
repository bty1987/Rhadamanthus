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
import com.fanglin.personel.service.UserService;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.po.OperationPO;
import com.fanglin.system.service.OperationService;
import com.fanglin.system.vo.OperationVO;
import com.fanglin.utils.Constant;
import com.fanglin.utils.CookieUtil;
import com.fanglin.utils.DateUtil;
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

	@Override
	public String intercept(ActionInvocation invocation) throws Exception {

		ActionContext ctx = invocation.getInvocationContext();
		HttpServletRequest request = (HttpServletRequest) ctx.get(StrutsStatics.HTTP_REQUEST);
		HttpServletResponse response = (HttpServletResponse) ctx.get(StrutsStatics.HTTP_RESPONSE);

		String $authentication = request.getParameter("authentication");

		String userId = "base";
		String actionName = invocation.getProxy().getActionName();

		ValueStack stack = invocation.getStack();

		try {

			OperationVO operationVO = operationService.checkOperation(new OperationVO(actionName));

			if (operationVO.getThrough() != null && operationVO.getThrough() == OperationPO.THROUGH_PASS_INT) {
				invocation.invoke();
			} else if (operationVO.getThrough() != null && operationVO.getThrough() == OperationPO.THROUGH_COMMON_INT) {

				String decryptString = AESHelper.decrypt($authentication, SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv"));

				if (decryptString == null || "".equals(decryptString)) {
					throw new FLException(-2, "无操作权限");
				}

				Authentication authentication = new Authentication(decryptString);

				if (authentication.getUserId() == null && !"fanglincommon".equals(decryptString)) {
					throw new FLException(-2, "无操作权限");
				}

				invocation.invoke();

			} else if (request.getHeader("x-ddpaas-signature") != null) {

				new Duthentication().check(request.getHeader("x-ddpaas-signature"), request.getHeader("x-ddpaas-signature-timestamp"));

				userId = request.getParameter("userId");

				if (userId == null) {
					throw new FLException(110005, "登陆超时");
				}

				UserVO userVO = userService.queryUserByUserId(new UserVO(userId));

				Authentication authentication = new Authentication(userId, userVO.getCurrentName(), userVO.getRole().getRid(), 0l, false, CompanyPO.TYPE_HEADQUARTER_INT, Authentication.TIMEOUT_INT);

				request.setAttribute("authentication", AESHelper.encrypt(authentication.getAuthenticationStr(), SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv")));

				invocation.invoke();

			} else {

				if ($authentication == null) {
					$authentication = CookieUtil.getCookie(request, Constant.COOKIE_AUTHENTICATION);
				}

				if ($authentication == null) {
					throw new FLException(110005, "登陆超时");
				}

				String decryptString = AESHelper.decrypt($authentication, SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv"));

				if (decryptString == null || "".equals(decryptString)) {
					LogUtils.logging(logger, actionName, 0, "aseerror");
					throw new FLException(110005, "登陆超时");
				}

				Authentication authentication = new Authentication(decryptString);
				Timestamp startTime = DateUtil.getDateToTimestamp(new Date());

				if (authentication.getUserId() != null) {

					userId = authentication.getUserId();

					LogUtils.logging(logger, authentication.getUserId(), actionName, authentication.getCompany());

					if (authentication.getUpdateTime() == -1) {
						CookieUtil.delCookie(request, response, Constant.COOKIE_AUTHENTICATION);
						throw new FLException(110005, "登陆超时");
					}

					if (authentication.getTimout() != Authentication.TIMEOUT_INT && authentication.isOverTime(SystemConfig.getInt("cookieOvertime", 30))) {
						throw new FLException(110005, "登陆超时");
					}

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

					Long runTime = endTime.getTime() - startTime.getTime();

					if (runTime > 5000) {
						LogUtils.logging(logger, actionName, runTime);
					}
				}
			}
		} catch (LockAcquisitionException e) {
			stack.setValue("errorCode", "-2");
			stack.setValue("errorMsg", "数据冲突,请重新再试!");
		} catch (FLException e) {
			stack.setValue("errorCode", e.getCode());
			stack.setValue("errorMsg", e.getErrorMessage());
		} catch (Exception e) {
			stack.setValue("errorCode", "110000");
			stack.setValue("errorMsg", "操作失败,请稍后重试");

			LogUtils.logging(logger, e, actionName, userId);
		}

		return Action.SUCCESS;
	}
}
