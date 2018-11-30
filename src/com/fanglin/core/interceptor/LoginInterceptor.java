package com.fanglin.core.interceptor;

import org.hibernate.exception.LockAcquisitionException;
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
		}catch (LockAcquisitionException e) {
			invocation.getStack().setValue("errorCode", "-2");
			invocation.getStack().setValue("errorMsg", "数据冲突,请重新再试!");
		}catch (FLException e) {
			invocation.getStack().setValue("errorCode", e.getCode());
			invocation.getStack().setValue("errorMsg", e.getErrorMessage());
		}catch (Exception e) {
			invocation.getStack().setValue("errorCode", "110000");
			invocation.getStack().setValue("errorMsg", "操作失败,请稍后重试");
			
			LogUtils.logging(logger, e, actionName, "common");
		}
		
		return Action.SUCCESS;
	}

}
