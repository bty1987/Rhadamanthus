/*
 * @File Name	: AuthenticationUtil.java
 * @Package		：com.fanglin.utils
 * @Version		: 1.0
 * @Date		: 2014-7-9
 * @Copyright	: Copyright Creators 2014
 * @Author		: mzy
 * @Email		: 
 * Describing	: cookie认证相关的操作的工具类
 */

package com.fanglin.utils;

import java.util.Date;
import java.util.regex.Pattern;

public class AuthenticationUtil {
	
	private String userId;
	
	private String userName;
	
	private String roleId;
	
	private long updateTime;
	
	private boolean isMobile;
	
	private String flag = "FIP";

	public AuthenticationUtil() {
		super();
	}

	public AuthenticationUtil(String userId, String userName, String roleId, long updateTime, boolean isMobile) {
		super();
		this.userId = userId;
		this.userName = userName;
		this.roleId = roleId;
		this.updateTime = updateTime;
		this.isMobile = isMobile;
	}

	/**
	 * 构造函数
	 * @param cookieAuthenticationStr 非加密的cookie认证串
	 */
	public AuthenticationUtil(String cookieAuthenticationStr){
		
		String[] authentication = cookieAuthenticationStr.split(Constant.COOKIE_AUTHENTICATION_SPLIT);

		if(authentication.length == Constant.COOKIE_AUTHENTICATION_NUM){

			if(authentication[0].startsWith(Constant.COOKIE_AUTHENTICATION_USERID)
				&& authentication[1].startsWith(Constant.COOKIE_AUTHENTICATION_ROLEID)
				&& authentication[2].startsWith(Constant.COOKIE_AUTHENTICATION_USERNAME)
				&& authentication[3].startsWith(Constant.COOKIE_AUTHENTICATION_UPDATETIME)
				&& authentication[4].startsWith(Constant.COOKIE_AUTHENTICATION_ISMOBILE)){
				
				this.userId = authentication[0].substring(Constant.COOKIE_AUTHENTICATION_USERID.length());
				this.roleId = authentication[1].substring(Constant.COOKIE_AUTHENTICATION_ROLEID.length());
				this.userName = authentication[2].substring(Constant.COOKIE_AUTHENTICATION_USERNAME.length());
				String updateString = authentication[3].substring(Constant.COOKIE_AUTHENTICATION_UPDATETIME.length());
				String isMobileStr = authentication[4].substring(Constant.COOKIE_AUTHENTICATION_ISMOBILE.length());
				
				try{
					Long updateLong = Long.parseLong(updateString);
					this.updateTime = updateLong;
					
					Pattern pattern = Pattern.compile("[0-9]*");
					if(isMobileStr != null && pattern.matcher(isMobileStr).matches()){
						int _ = Integer.parseInt(isMobileStr);
						this.isMobile = _ > 0 ? true : false;
					}else{
						this.isMobile = false;
					}
					
				}catch (Exception e){
					this.userId = null;
					this.userName = null;
					this.updateTime = -1;
					this.roleId = null;
					this.isMobile = false;
				}
			}else{
				this.userId = null;
				this.userName = null;
				this.updateTime = -1;
				this.roleId = null;
				this.isMobile = false;
			}
		}else{
			this.userId = null;
			this.userName = null;
			this.updateTime = -1;
			this.roleId = null;
			this.isMobile = false;
		}
	}
	
	/**
	 * 判断认证是否超时
	 * 
	 * @param overTimeMin 超时衡量的分钟数
	 * @return 超时返回true 否则返回false
	 */
	public boolean isOverTime(int overTimeMin){
		
		boolean result = false;
		long now = (new Date()).getTime();
		long _ = now - this.updateTime;
		
		if(_ > (overTimeMin * 60 * 1000)){
			result = true;
		}
		
		return result;
	}
	
	/**
	 * 返回当前的非加密认证串
	 * 
	 * @return 当前的非加密认证串
	 */
	public String getAuthenticationStr(){
		
		StringBuffer authentication = new StringBuffer();
		authentication.append(Constant.COOKIE_AUTHENTICATION_USERID);
		authentication.append(getUserId());
		authentication.append(Constant.COOKIE_AUTHENTICATION_SPLIT);
		authentication.append(Constant.COOKIE_AUTHENTICATION_ROLEID);
		authentication.append(getRoleId());
		authentication.append(Constant.COOKIE_AUTHENTICATION_SPLIT);
		authentication.append(Constant.COOKIE_AUTHENTICATION_USERNAME);
		authentication.append(getUserName());
		authentication.append(Constant.COOKIE_AUTHENTICATION_SPLIT);
		authentication.append(Constant.COOKIE_AUTHENTICATION_UPDATETIME);
		authentication.append(getUpdateTime());
		authentication.append(Constant.COOKIE_AUTHENTICATION_SPLIT);
		authentication.append(Constant.COOKIE_AUTHENTICATION_ISMOBILE);
		authentication.append(isMobile() ? "1" : "0");
		authentication.append(Constant.COOKIE_AUTHENTICATION_SPLIT);
		authentication.append(Constant.COOKIE_AUTHENTICATION_FLAG);
		authentication.append(getFlag());
		
		return authentication.toString();
	}
	
	public String getUserId(){
		return userId;
	}

	public void setUserId(String userId){
		this.userId = userId;
	}

	public String getUserName(){
		return userName;
	}

	public void setUserName(String userName){
		this.userName = userName;
	}

	public String getRoleId(){
		return roleId;
	}

	public void setRoleId(String roleId){
		this.roleId = roleId;
	}

	public long getUpdateTime(){
		return updateTime;
	}

	public void setUpdateTime(long updateTime){
		this.updateTime = updateTime;
	}

	public boolean isMobile() {
		return isMobile;
	}

	public void setIsMobile(boolean isMobile) {
		this.isMobile = isMobile;
	}

	public String getFlag() {
		return flag;
	}

	public void setFlag(String flag) {
		this.flag = flag;
	}

}
