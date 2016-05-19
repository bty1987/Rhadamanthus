/**
 * @File Name	: BaseAction.java
 * @Package		：com.fanglin.action 
 * @Version		: 1.0
 * @Date		: 2014-7-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: mzy
 * @Email		: 
 * @Describing	: 基类Action 当返回的是非列表的Action是继承该类，返回列表时继承BaseListAction类
 */

package com.fanglin.core.action;

import java.io.UnsupportedEncodingException;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ResourceBundle;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.ExceptionMapping;
import org.apache.struts2.convention.annotation.ExceptionMappings;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.apache.struts2.interceptor.ServletRequestAware;
import org.apache.struts2.interceptor.ServletResponseAware;
import org.apache.struts2.json.annotations.JSON;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.AESHelper;
import com.fanglin.log.vo.LogVO;
import com.fanglin.utils.AuthenticationUtil;
import com.fanglin.utils.Constant;
import com.fanglin.utils.CookieUtil;
import com.fanglin.utils.SystemConfig;
import com.opensymphony.xwork2.ActionSupport;

@ParentPackage("login")
@Namespace("/")
@Controller
@Results({ 
	@Result(name = BaseAction.BACKVALUE_NOPERATE_STR,  location = "noperateAuthority", type = "chain"),
	@Result(name = BaseAction.BACKVALUE_ERROR_STR,  location = "operateError", type = "chain"),
	@Result(name = BaseAction.BACKVALUE_TIMEOUT_STR, location = "timeout", type = "chain"),
	@Result(name = BaseAction.BACKVALUE_LOGIN_STR, location = "login", type = "chain")
})
@ExceptionMappings({ @ExceptionMapping(exception = "java.lange.RuntimeException", result = "error") })
public class BaseAction extends ActionSupport implements ServletRequestAware, ServletResponseAware {

	private static final long serialVersionUID = 1638203239536571772L;
	
	public static final String BACKVALUE_NOPERATE_STR = "noperate";
	
	public static final String BACKVALUE_ERROR_STR = "error";
	
	public static final String BACKVALUE_LOGIN_STR = "login";
	
	public static final String BACKVALUE_TIMEOUT_STR = "timeout";

	protected Logger log = LoggerFactory.getLogger(getClass());

	protected HttpServletRequest request;

	protected HttpServletResponse response;
	
	private int errorCode = 0;
	
	private String errorMsg;
	
	private String hostServer;
	
	private String mediaServer;
	
	private String communionServer;
	
	private String dmediaServer;
	
	private LogVO logVO = new LogVO();
	
	Map<String, Object> logObjs = new HashMap<String, Object>();
	
	public String getHostServer(){
		
		String customerIp = request.getHeader("X-Real-IP");
		
		if(customerIp == null || "".equals(customerIp) || customerIp.startsWith("192") || customerIp.startsWith("127")){
			hostServer = SystemConfig.getString("localHostServer");
			return hostServer;
		}else{
			hostServer = SystemConfig.getString("hostServer");
			return hostServer;
		}
	}

	public String getMediaServer(){
		
		String customerIp = request.getHeader("X-Real-IP");
		
		if(customerIp == null || "".equals(customerIp) || customerIp.startsWith("192") || customerIp.startsWith("127")){
			mediaServer = SystemConfig.getString("localMediaServer");
			return mediaServer;
		}else{
			mediaServer = SystemConfig.getString("mediaServer");
			return mediaServer;
		}
	}
	
	public String getCommunionServer(){
		String customerIp = request.getHeader("X-Real-IP");
		
		if(customerIp == null || "".equals(customerIp) || customerIp.startsWith("192") || customerIp.startsWith("127")){
			communionServer = SystemConfig.getString("localCommunionServer");
			return communionServer;
		}else{
			communionServer = SystemConfig.getString("communionServer");
			return communionServer;
		}
	}

	public String getDmediaServer() {
		
		dmediaServer = SystemConfig.getString("dmediaHost");
		
		return dmediaServer;
	}

	@Action(value = "operateError", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" } )
	public String operateError(){
		
		return SUCCESS;
	}
	
	@Action(value = "noperateAuthority", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" } )
	public String noperateAuthority(){
		
		setErrorCode(-2);
		setErrorMsg("无操作权限");
		
		return SUCCESS;
	}
	
	@Action(value = "timeout", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" } )
	public String timeout(){
		
		setErrorCode(110005);
		setErrorMsg("登陆超时");
		
		return SUCCESS;
	}
	
	public String getVerifyCode() throws FLException{
		String verifyCode = null;
		
		try{
			String value = CookieUtil.getCookie(request, Constant.COOKIE_VERIFYCODE);
		
			if(value != null){
				String encryptKey = SystemConfig.getString("encryptKey");
				verifyCode = AESHelper.decryptString(value, encryptKey);
			}
		}catch(Exception e){
			e.printStackTrace();
			throw new FLException(110005, "系统处理问题");
		}
		
		return verifyCode;
	}
	
	public String getUserName() throws FLException{
		String userName = null;
		
		try{
			String authentication = getAuthentication();
		
			if(authentication != null){
				String encryptKey = SystemConfig.getString("encryptKey");
				String decryptString = AESHelper.decryptString(authentication, encryptKey);
				
				AuthenticationUtil authenticationUtil = new AuthenticationUtil(decryptString);
				if(authenticationUtil.getUpdateTime() != -1){
					userName = authenticationUtil.getUserName();
				}
			}
		}catch(Exception e){
			throw new FLException(110005, "系统处理问题");
		}
		
		return userName;
	}
	
	public String getUserId() throws FLException{
		String userId = null;
		
		try{
			String authentication = getAuthentication();
		
			if(authentication != null){
				String encryptKey = SystemConfig.getString("encryptKey");
				String decryptString = AESHelper.decryptString(authentication, encryptKey);
				
				AuthenticationUtil au = new AuthenticationUtil(decryptString);
				if(au.getUpdateTime() != -1){
					userId = au.getUserId();
				}
			}
		}catch(Exception e){
			throw new FLException(110005, "系统处理问题");
		}
		
		return userId;
	}
	
	public String getRoleId() throws FLException{
		String roleId = null;
		
		try{
			String authentication = getAuthentication();
		
			if(authentication != null){
				String encryptKey = SystemConfig.getString("encryptKey");
				String decryptString = AESHelper.decryptString(authentication, encryptKey);
				
				AuthenticationUtil au = new AuthenticationUtil(decryptString);
				if(au.getUpdateTime() != -1){
					roleId = au.getRoleId();
				}
			}
		}catch(Exception e){
			throw new FLException(110005, "系统处理问题");
		}
		
		return roleId;
	}

	public void clearCookie() throws FLException{
		String decorationOrderId;
		String quotationId;
		
		try {
			decorationOrderId = CookieUtil.getCookie(request, Constant.COOKIE_DECORATIONORDER_ORDERID);
			
			if(decorationOrderId != null){
				CookieUtil.delCookie(request, response, Constant.COOKIE_DECORATIONORDER_ORDERID);
			}
			
			quotationId = CookieUtil.getCookie(request,Constant.COOKIE_QUOTATIONID);
			
			if(quotationId != null){
				CookieUtil.delCookie(request, response, Constant.COOKIE_QUOTATIONID);
			}
			
		} catch (UnsupportedEncodingException e){
			throw new FLException(110005, "系统处理问题");
		}
	}
	
	private String getAuthentication() throws FLException{
		
		String authentication;
		
		try {
			authentication = request.getParameter("authentication");
			
			if(authentication == null){
				authentication = CookieUtil.getCookie(request, Constant.COOKIE_AUTHENTICATION);
			}
			
			return authentication;
		} catch (UnsupportedEncodingException e) {
			throw new FLException(110005, "系统处理问题");
		}
	}
	
	@Override
	public void setServletResponse(HttpServletResponse response){
		this.response = response;
	}

	@Override
	public void setServletRequest(HttpServletRequest request){
		this.request = request;
	}

	public int getErrorCode(){
		return errorCode;
	}

	public void setErrorCode(int errorCode){
		this.errorCode = errorCode;
	}

	public String getErrorMsg(){
		return errorMsg;
	}

	public void setErrorMsg(String errorMsg){
		this.errorMsg = errorMsg;
	}

	@Override
	@JSON(serialize = false)
	public Collection<String> getActionErrors(){
		return super.getActionErrors();
	}

	@Override
	@JSON(serialize = false)
	public Collection<String> getActionMessages(){
		return super.getActionMessages();
	}

	@Override
	@JSON(serialize = false)
	public Map<String, List<String>> getFieldErrors(){
		return super.getFieldErrors();
	}

	@Override
	@JSON(serialize = false)
	public ResourceBundle getTexts(){
		return super.getTexts();
	}

	@Override
	@Deprecated
	@JSON(serialize = false)
	public Collection<String> getErrorMessages(){
		return super.getErrorMessages();
	}

	@Override
	@Deprecated
	@JSON(serialize = false)
	public Map<String, List<String>> getErrors(){
		return super.getErrors();
	}

	public void setLogVO(LogVO logVO){
		this.logVO = logVO;
	}

	@JSON(serialize = false)
	public LogVO getLogVO(){
		return logVO;
	}
	
	@JSON(serialize = false)
	public Map<String, Object> getLogObjs(){
		if(logObjs == null){
			logObjs = new HashMap<String, Object>();
		}
		
		if(logObjs.size() == 0){
			logObjs.put("errorCode", getErrorCode());
			logObjs.put("errorMsg", getErrorMsg());
		}
		
		return logObjs;
	}

	public void setLogObjs(Map<String, Object> logObjs){
		this.logObjs = logObjs;
	}

	public void setMediaServer(String mediaServer){
		this.mediaServer = mediaServer;
	}

	public void setDmediaServer(String dmediaServer) {
		this.dmediaServer = dmediaServer;
	}

}
