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
import com.fanglin.system.service.OperationService;
import com.fanglin.utils.Constant;
import com.fanglin.utils.CookieUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.LogUtils;
import com.fanglin.utils.SystemConfig;
import com.opensymphony.xwork2.Action;
import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.AbstractInterceptor;

public class AccessInterceptor extends AbstractInterceptor {
	private static final long serialVersionUID = -1754802896214390640L;

	protected Logger logger = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private OperationService operationService;
	
	@Override
	public String intercept(ActionInvocation invocation) throws Exception {
		
		ActionContext ctx = invocation.getInvocationContext();
		HttpServletRequest request = (HttpServletRequest) ctx.get(StrutsStatics.HTTP_REQUEST);
		HttpServletResponse response = (HttpServletResponse) ctx.get(StrutsStatics.HTTP_RESPONSE);
		
		String $authentication = request.getParameter("authentication");
		
		String actionName = invocation.getProxy().getActionName();
		
		try {
			
			if(actionName.startsWith("via") || actionName.startsWith("report")){
				invocation.invoke();
			}else{
				
				if($authentication == null){
					$authentication = CookieUtil.getCookie(request, Constant.COOKIE_AUTHENTICATION);
				}
				
				if($authentication == null){
					throw new FLException(110005, "登陆超时");
				}
				
				String encryptKey = SystemConfig.getString("encryptKey");
				
				String decryptString = AESHelper.decryptString($authentication, encryptKey);
				
				Authentication authentication = new Authentication(decryptString);
				Timestamp startTime = DateUtil.getDateToTimestamp(new Date());
				
				if(authentication.getUserId() != null){
					
					LogUtils.logging(logger, authentication.getUserId(), actionName);
					
					if(authentication.getUpdateTime() == -1){
						CookieUtil.delCookie(request, response, Constant.COOKIE_AUTHENTICATION);
						throw new FLException(110005, "登陆超时");
					}
					
					if(authentication.getTimout() != Authentication.TIMEOUT_INT && authentication.isOverTime(SystemConfig.getInt("cookieOvertime", 30))){
						throw new FLException(110005, "登陆超时");
					}
					
					authentication.setUpdateTime((new Date()).getTime());
					String authenticationString = authentication.getAuthenticationStr();
					String authenticationEncodeString = AESHelper.encryptToString(authenticationString, SystemConfig.getString("encryptKey"));
					
					CookieUtil.addCookie((HttpServletResponse) ctx.get(StrutsStatics.HTTP_RESPONSE), Constant.COOKIE_AUTHENTICATION, authenticationEncodeString);
					
					if(operationService.checkOperationByUserId(authentication.getUserId(), actionName, authentication.getRollcall())){
						invocation.invoke();
					}else{
						throw new FLException(-2, "无操作权限");
					}
				}else{
					throw new FLException(110005, "登陆超时");
				}
				
				Timestamp endTime = DateUtil.getDateToTimestamp(new Date());
				
				if((Integer) invocation.getStack().findValue("errorCode") != null){
					
					Long runTime = endTime.getTime() - startTime.getTime();
					
					if(runTime > 5000){
						LogUtils.logging(logger, actionName, runTime);
					}
				}
			}
		}catch (LockAcquisitionException e) {
			invocation.getStack().setValue("errorCode", "-2");
			invocation.getStack().setValue("errorMsg", "数据冲突,请重新再试!");
		}catch (FLException e) {
			invocation.getStack().setValue("errorCode", e.getCode());
			invocation.getStack().setValue("errorMsg", e.getErrorMessage());
		}catch (Exception e) {
			invocation.getStack().setValue("errorCode", "110000");
			invocation.getStack().setValue("errorMsg", "系统问题");
			
			LogUtils.logging(logger, e, actionName);
		}
		
		return Action.SUCCESS;
	}
	
}
