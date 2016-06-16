/**
 * @File Name		: QuotationVersionPO.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-7-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.salary.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Entity;
import javax.persistence.Table;

import org.apache.struts2.json.annotations.JSON;

import com.google.gson.annotations.SerializedName;

@Entity
@Table(name = "decorationPayment")
public class UserSalaryVO implements Serializable {

	private static final long serialVersionUID = 134111112211146L;

	private Long autoId;

	@SerializedName("员工编号")
	private String userId;
	
	@SerializedName("员工名")
	private String userName;
	
	@SerializedName("部门类型")
	private String deptType;
	
	@SerializedName("职位")
	private String duty;
	
	@SerializedName("电话")
	private String phone;
	
	@SerializedName("类型")
	private String type;// '报价扣款、考勤扣款、保险扣款、其他扣款、月度奖金、季度奖金、年终奖金、其他奖金、补款',
	
	@SerializedName("创建时间")
	private Timestamp createTime;
	
	@SerializedName("创建人编号")
	private String createUserId;
	
	@SerializedName("创建人")
	private String createUserName;
	
	@SerializedName("备注")
	protected String comments;
	
	@SerializedName("金额")
	private Float money;
	
	@SerializedName("状态")
	private Integer status = 0; // '0 初始状态 1 已结算',
	
	@SerializedName("结算人编号")
	private String dealUserId;
	
	@SerializedName("结算人")
	private String dealUserName;
	
	@SerializedName("结算时间")
	private Timestamp dealTime;

	public Long getAutoId(){
		return autoId;
	}

	public void setAutoId(Long autoId){
		this.autoId = autoId;
	}

	public void setCreateTime(Timestamp createTime){
		this.createTime = createTime;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getCreateTime(){
		return createTime;
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

	public String getType(){
		return type;
	}

	public void setType(String type){
		this.type = type;
	}

	public String getCreateUserId(){
		return createUserId;
	}

	public void setCreateUserId(String createUserId){
		this.createUserId = createUserId;
	}

	public String getCreateUserName(){
		return createUserName;
	}

	public void setCreateUserName(String createUserName){
		this.createUserName = createUserName;
	}

	public String getComments(){
		return comments;
	}

	public void setComments(String comments){
		this.comments = comments;
	}

	public Float getMoney(){
		return money;
	}

	public void setMoney(Float money){
		this.money = money;
	}

	public Integer getStatus(){
		return status;
	}

	public void setStatus(Integer status){
		this.status = status;
	}

	public String getDealUserId(){
		return dealUserId;
	}

	public void setDealUserId(String dealUserId){
		this.dealUserId = dealUserId;
	}

	public String getDealUserName(){
		return dealUserName;
	}

	public void setDealUserName(String dealUserName){
		this.dealUserName = dealUserName;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getDealTime(){
		return dealTime;
	}

	public void setDealTime(Timestamp dealTime){
		this.dealTime = dealTime;
	}

	public void setPhone(String phone){
		this.phone = phone;
	}

	public String getPhone(){
		return phone;
	}

	public void setDuty(String duty){
		this.duty = duty;
	}

	public String getDuty(){
		return duty;
	}

	public void setDeptType(String deptType){
		this.deptType = deptType;
	}

	public String getDeptType(){
		return deptType;
	}

}
