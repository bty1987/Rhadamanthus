/**
 * @File Name		: QuotationTemplatePO.java
 * @Package 	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-7-26
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.log.vo;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Date;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.utils.DateUtil;
import com.fanglin.utils.UUIDUtil;

public class LogVO implements Serializable {
	
	private static final long serialVersionUID = -7114740524313501162L;

	private String createUserId;
	
	private String CreateUserName;
	
	private String duty;
	
	private String roleId;
	
	private String roleName;
	
	private long runTime;
	
	private String actionName ;
	
	private String uuid;
	
	private Timestamp createTime;
	
	public LogVO(){
	}

	public LogVO(String uuid, String createUserId, Timestamp creatTime){
		this.uuid = uuid;
		this.createTime = creatTime;
		this.createUserId = createUserId;
	}

	public LogVO(String createUserId){
		this.uuid = UUIDUtil.getUuid();
		this.createTime = DateUtil.getDateToTimestamp(new Date());
		this.createUserId = createUserId;
	}

	public LogVO(String createUserId, Timestamp creatTime){
		this.uuid = UUIDUtil.getUuid();
		this.createTime = creatTime;
		this.createUserId = createUserId;
	}

	public String getUuid(){
		return uuid;
	}

	public void setUuid(String uuid){
		this.uuid = uuid;
	}

	public String getCreateUserId(){
		return createUserId;
	}

	public void setCreateUserId(String createUserId){
		this.createUserId = createUserId;
	}

	public String getCreateUserName(){
		return CreateUserName;
	}

	public void setCreateUserName(String createUserName){
		CreateUserName = createUserName;
	}

	public String getDuty(){
		return duty;
	}

	public void setDuty(String duty){
		this.duty = duty;
	}

	public String getRoleId(){
		return roleId;
	}

	public void setRoleId(String roleId){
		this.roleId = roleId;
	}

	public String getRoleName(){
		return roleName;
	}

	public void setRoleName(String roleName){
		this.roleName = roleName;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime(){
		return createTime;
	}

	public void setCreateTime(Timestamp createTime){
		this.createTime = createTime;
	}

	public void setActionName(String actionName){
		this.actionName = actionName;
	}

	public String getActionName(){
		return actionName;
	}

	public void setRunTime(long runTime){
		this.runTime = runTime;
	}

	public long getRunTime(){
		return this.runTime;
	}
}
