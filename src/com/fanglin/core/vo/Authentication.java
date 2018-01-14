/**
 * @File Name	: AuthenticationUtil.java
 * @Package		：com.fanglin.utils
 * @Version		: 1.0
 * @Date		: 2014-7-9
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email		: 
 * Describing	: cookie认证相关的操作的工具类
 */

package com.fanglin.core.vo;

import java.util.Date;

public class Authentication {
	
	public static final short TIMEOUT_INT = 1;
	
	public static final short ROLLCALL_INT = 2;
	
	private static final int COOKIE_AUTHENTICATION_NUM = 7;
	
	private static final String COOKIE_AUTHENTICATION_USERID = "userId=";
	
	private static final String COOKIE_AUTHENTICATION_ROLEID = "roleId=";
	
	private static final String COOKIE_AUTHENTICATION_USERNAME = "userName=";
	
	private static final String COOKIE_AUTHENTICATION_UPDATETIME = "updateTime=";
	
	private static final String COOKIE_AUTHENTICATION_COMPANY = "company=";
	
	private static final String COOKIE_AUTHENTICATION_TIMEOUT = "timeout=";
	
	private static final String COOKIE_AUTHENTICATION_ROLLCALL = "rollcall=";
	
	private static final String COOKIE_AUTHENTICATION_SPLIT = ",";
	
	private String userId;
	
	private String userName;
	
	private String roleId;
	
	private Long updateTime;
	
	private Integer company;
	
	private short timout;
	
	private short rollcall;
	
	public Authentication() {
		super();
	}

	public Authentication(String userId, String userName, String roleId, long updateTime, boolean isMobile, int company, short freedom) {
		super();
		this.userId = userId;
		this.userName = userName;
		this.roleId = roleId;
		this.updateTime = updateTime;
		this.company = company;
		
		this.timout = (short) ((freedom & TIMEOUT_INT) == TIMEOUT_INT ? 1 : 0);
		this.rollcall = (short) ((freedom & ROLLCALL_INT) == ROLLCALL_INT ? 1 : 0);
	}

	/**
	 * 构造函数
	 * @param cookieAuthenticationStr 非加密的cookie认证串
	 */
	public Authentication(String cookieAuthenticationStr){
		
		String[] authentication = cookieAuthenticationStr.split(COOKIE_AUTHENTICATION_SPLIT);
		
		cleanAuthentication();
		
		if(authentication.length == COOKIE_AUTHENTICATION_NUM){

			if(authentication[0].startsWith(COOKIE_AUTHENTICATION_USERID) && 
					authentication[1].startsWith(COOKIE_AUTHENTICATION_ROLEID) && 
					authentication[2].startsWith(COOKIE_AUTHENTICATION_USERNAME) && 
					authentication[3].startsWith(COOKIE_AUTHENTICATION_UPDATETIME) && 
					authentication[4].startsWith(COOKIE_AUTHENTICATION_COMPANY) && 
					authentication[5].startsWith(COOKIE_AUTHENTICATION_TIMEOUT) && 
					authentication[6].startsWith(COOKIE_AUTHENTICATION_ROLLCALL)
				){
				
				try{
					this.userId = authentication[0].substring(COOKIE_AUTHENTICATION_USERID.length());
					this.roleId = authentication[1].substring(COOKIE_AUTHENTICATION_ROLEID.length());
					this.userName = authentication[2].substring(COOKIE_AUTHENTICATION_USERNAME.length());
					this.updateTime = Long.parseLong(authentication[3].substring(COOKIE_AUTHENTICATION_UPDATETIME.length()));
					this.company = Integer.valueOf(authentication[4].substring(COOKIE_AUTHENTICATION_COMPANY.length()));
					this.timout = Short.valueOf(authentication[5].substring(COOKIE_AUTHENTICATION_TIMEOUT.length()));
					this.rollcall = Short.valueOf(authentication[6].substring(COOKIE_AUTHENTICATION_ROLLCALL.length()));
				}catch (Exception e){
					cleanAuthentication();
				}
			}
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
		authentication.append(COOKIE_AUTHENTICATION_USERID);
		authentication.append(getUserId());
		authentication.append(COOKIE_AUTHENTICATION_SPLIT);
		authentication.append(COOKIE_AUTHENTICATION_ROLEID);
		authentication.append(getRoleId());
		authentication.append(COOKIE_AUTHENTICATION_SPLIT);
		authentication.append(COOKIE_AUTHENTICATION_USERNAME);
		authentication.append(getUserName());
		authentication.append(COOKIE_AUTHENTICATION_SPLIT);
		authentication.append(COOKIE_AUTHENTICATION_UPDATETIME);
		authentication.append(getUpdateTime());
		authentication.append(COOKIE_AUTHENTICATION_SPLIT);
		authentication.append(COOKIE_AUTHENTICATION_COMPANY);
		authentication.append(getCompany());
		authentication.append(COOKIE_AUTHENTICATION_SPLIT);
		authentication.append(COOKIE_AUTHENTICATION_TIMEOUT);
		authentication.append(getTimout());
		authentication.append(COOKIE_AUTHENTICATION_SPLIT);
		authentication.append(COOKIE_AUTHENTICATION_ROLLCALL);
		authentication.append(getRollcall());
		
		return authentication.toString();
	}
	
	private void cleanAuthentication(){
		this.userId = null;
		this.userName = null;
		this.updateTime = -1l;
		this.roleId = null;
		this.company = -1;
		this.timout = -1;
		this.rollcall = -1;
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

	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	public short getTimout() {
		return timout;
	}

	public void setTimout(short timout) {
		this.timout = timout;
	}

	public short getRollcall() {
		return rollcall;
	}

	public void setRollcall(short rollcall) {
		this.rollcall = rollcall;
	}

}
