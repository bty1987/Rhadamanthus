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
import com.google.gson.annotations.SerializedName;

public class LogVO implements Serializable {
	
	private static final long serialVersionUID = -7114740524313501162L;

	@SerializedName("创建人编号")
	private String createUserId;
	
	//创建人名
	@SerializedName("创建人")
	private String CreateUserName;
	
	//创建人职称
	@SerializedName("职位")
	private String duty;
	
	//创建人角色Id
	@SerializedName("角色编号")
	private String roleId;
	
	//创建人角色名
	@SerializedName("角色名")
	private String roleName;
	
	//操作结束时间
	@SerializedName("耗时ms")
	private long runTime;
	
	@SerializedName("操作")
	private String actionName ;
	
	//主键
	@SerializedName("主键")
	private String uuid;
	
	//创建时间
	@SerializedName("创建时间")
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
