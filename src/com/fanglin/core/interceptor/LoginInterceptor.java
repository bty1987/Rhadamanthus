package com.fanglin.core.interceptor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fanglin.utils.LogUtils;
import com.opensymphony.xwork2.Action;
import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.AbstractInterceptor;

public class LoginInterceptor extends AbstractInterceptor {

	private static final long serialVersionUID = -1754802896214390640L;

	protected Logger logger = LoggerFactory.getLogger(getClass());

	@Override
	public String intercept(ActionInvocation invocation) throws Exception {

		String actionName = invocation.getProxy().getActionName();

		try {
			invocation.invoke();
		} catch (Exception e) {
			if (FLExceptionResolver.resolve(invocation, e)) {
				LogUtils.logging(logger, e, actionName, "common");
			}
		}

		return Action.SUCCESS;
	}

}
