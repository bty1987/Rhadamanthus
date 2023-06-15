package com.fanglin.core.interceptor;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.StrutsStatics;
import org.hibernate.exception.LockAcquisitionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fanglin.core.security.AESHelper;
import com.fanglin.core.vo.Authentication;
import com.fanglin.utils.LogUtils;
import com.fanglin.utils.SystemConfig;
import com.opensymphony.xwork2.Action;
import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.AbstractInterceptor;

public class CommonInterceptor extends AbstractInterceptor {

	private static final long serialVersionUID = -1754802896214390640L;

	protected Logger logger = LoggerFactory.getLogger(getClass());

	@Override
	public String intercept(ActionInvocation invocation) throws Exception {

		ActionContext ctx = invocation.getInvocationContext();
		HttpServletRequest request = (HttpServletRequest) ctx.get(StrutsStatics.HTTP_REQUEST);

		String actionName = invocation.getProxy().getActionName();

		try {

			LogUtils.logging(logger, "common", actionName, 0);

			String $authentication = request.getParameter("authentication");

			String decryptString = AESHelper.decrypt($authentication, SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv"));

			if (decryptString == null || "".equals(decryptString)) {
				throw new FLException(-2, "无操作权限");
			}

			Authentication authentication = new Authentication(decryptString);

			if (authentication.getUserId() == null && !"fanglincommon".equals(decryptString)) {
				throw new FLException(-2, "无操作权限");
			}

			invocation.invoke();
		} catch (LockAcquisitionException e) {
			invocation.getStack().setValue("errorCode", "-2");
			invocation.getStack().setValue("errorMsg", "数据冲突,请重新再试!");
		} catch (FLException e) {
			invocation.getStack().setValue("errorCode", e.getCode());
			invocation.getStack().setValue("errorMsg", e.getErrorMessage());
		} catch (Exception e) {
			invocation.getStack().setValue("errorCode", "110000");
			invocation.getStack().setValue("errorMsg", "操作失败,请稍后重试");

			LogUtils.logging(logger, e, actionName, "common");
		}

		return Action.SUCCESS;
	}

}
