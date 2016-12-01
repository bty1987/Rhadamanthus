package com.fanglin.core.interceptor;

import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.StrutsStatics;
import org.hibernate.exception.LockAcquisitionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.fanglin.core.security.AESHelper;
import com.fanglin.core.vo.Authentication;
import com.fanglin.log.po.ActionLogPO;
import com.fanglin.log.service.LogService;
import com.fanglin.personel.po.UserPO;
import com.fanglin.system.service.OperationService;
import com.fanglin.utils.Constant;
import com.fanglin.utils.CookieUtil;
import com.fanglin.utils.DateUtil;
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
	public LogService logService;
	
	@Override
	public String intercept(ActionInvocation invocation) throws Exception {
		
		List<String> passLogNames = Arrays.asList(new String[]{"doLogin", "login"});
		List<String> passActionNames = Arrays.asList(new String[]{});
		
		String userId = "";
		
		ActionContext ctx = invocation.getInvocationContext();
		HttpServletRequest request = (HttpServletRequest) ctx.get(StrutsStatics.HTTP_REQUEST);
		HttpServletResponse response = (HttpServletResponse) ctx.get(StrutsStatics.HTTP_RESPONSE);
		
		String authentication = request.getParameter("authentication");
		
		String actionName = invocation.getProxy().getActionName();
		
		try {
			
			if(passActionNames.contains(actionName) || actionName.startsWith("report")){
				invocation.invoke();
			}else{
				
				if(authentication == null){
					authentication = CookieUtil.getCookie(request, Constant.COOKIE_AUTHENTICATION);
				}
				
				if(authentication == null){
					throw new FLException(110005, "登陆超时");
				}
				
				String encryptKey = SystemConfig.getString("encryptKey");
				String decryptString = AESHelper.decryptString(authentication, encryptKey);
				
				Authentication authenticationUtil = new Authentication(decryptString);
				Timestamp startTime = DateUtil.getDateToTimestamp(new Date());
				
				if(authenticationUtil.getUserId() != null){
					
					if(!actionName.startsWith("page") && !actionName.startsWith("query")){
						logger.error(String.format("%s - %s - %s - %s", "AI", "I", authenticationUtil.getUserId(), actionName));
					}
					
					if(authenticationUtil.getUpdateTime() == -1){
						CookieUtil.delCookie(request, response, Constant.COOKIE_AUTHENTICATION);
						throw new FLException(110005, "登陆超时");
					}
					
//					if(authenticationUtil.isOverTime(SystemConfig.getInt("cookieOvertime", 30)) && !authenticationUtil.isMobile()){
//						throw new FLException(110005, "登陆超时");
//					}
					
					authenticationUtil.setUpdateTime((new Date()).getTime());
					String authenticationString = authenticationUtil.getAuthenticationStr();
					String authenticationEncodeString = AESHelper.encryptToString(authenticationString, SystemConfig.getString("encryptKey"));
					
					CookieUtil.addCookie((HttpServletResponse) ctx.get(StrutsStatics.HTTP_RESPONSE), Constant.COOKIE_AUTHENTICATION, authenticationEncodeString);
					
					userId = authenticationUtil.getUserId();
					
					if(operationService.checkOperationByUserId(authenticationUtil.getUserId(), actionName)){
						invocation.invoke();
					}else{
						throw new FLException(-2, "无操作权限");
					}
				}else{
					throw new FLException(110005, "登陆超时");
				}
				
				Timestamp endTime = DateUtil.getDateToTimestamp(new Date());
				
				// 获得值栈
				ValueStack valueStack = invocation.getStack();
				Integer errorCode = (Integer) valueStack.findValue("errorCode");
				if(errorCode != null || !passLogNames.contains(actionName)){
					
					ActionLogPO actionLogPO = new ActionLogPO(actionName, new UserPO(userId), startTime, endTime.getTime() - startTime.getTime());
					
					if(actionLogPO.getRunTime() > 5000){
						logService.addActionLog(actionLogPO);
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
			
			if(SystemConfig.DEBUG_TRUE_STR.equals(SystemConfig.getString("debug", SystemConfig.DEBUG_FALSE_STR))){
				e.printStackTrace();
			}else{
				logger.error(String.format("%s - %s - %s - %s", "AI", "E", e.getMessage(), actionName));
			}
		}
		
		return Action.SUCCESS;
	}
	
}
