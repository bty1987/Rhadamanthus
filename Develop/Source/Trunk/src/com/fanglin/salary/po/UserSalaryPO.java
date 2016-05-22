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

package com.fanglin.salary.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "userSalary", catalog = "platform")
public class UserSalaryPO implements Serializable {

	private static final long serialVersionUID = -7226711123554310769L;

	public static String TYPE_PRICE_DEDUCTION_STR = "报价扣款";
	
	public static String TYPE_ATTENDANCE_DEDUCTION_STR = "考勤扣款";
	
	public static String TYPE_INSURANCE_DEDUCTION_STR = "保险扣款";
	
	public static String TYPE_OTHER_DEDUCTION_STR = "其他扣款";
	
	public static String TYPE_MONTHLY_BONUS_STR = "月度奖金";
	
	public static String TYPE_QUARTERLY_BONUS_STR = "季度奖金";
	
	public static String TYPE_DECEMBER_BONUS_STR = "年终奖金";
	
	public static String TYPE_OTHER_BONUS_STR = "其他奖金";
	
	public static String TYPE_REPLENISHMENT_STR = "补款";
	
	public static int STATUS_INIT_INT = 0;
	
	public static int STATUS_BALANCE_INT = 1;

	private Long autoId;
	
	private UserPO userPO;
	
	private String type; // '报价扣款、考勤扣款、保险扣款、其他扣款、月度奖金、季度奖金、年终奖金、其他奖金、补款',
	
	private Timestamp createTime;
	
	private UserPO createUserPO;
	
	private String comments;
	
	private Float money;
	
	private Integer status = 0; // '0 初始状态 1 已结算',
	
	private UserPO dealUserPO;
	
	private Timestamp dealTime;

	@Id
	@GeneratedValue
	@Column(name = "autoId")
	public Long getAutoId(){
		return autoId;
	}

	public void setAutoId(Long autoId){
		this.autoId = autoId;
	}

	public void setCreateTime(Timestamp createTime){
		this.createTime = createTime;
	}

	public Timestamp getCreateTime(){
		return createTime;
	}

	public void setCreateUserPO(UserPO createUserPO){
		this.createUserPO = createUserPO;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "createUserId", referencedColumnName = "userId")
	public UserPO getCreateUserPO(){
		return createUserPO;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "userId", referencedColumnName = "userId")
	public UserPO getUserPO(){
		return userPO;
	}

	public void setUserPO(UserPO userPO){
		this.userPO = userPO;
	}

	public String getType(){
		return type;
	}

	public void setType(String type){
		this.type = type;
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

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "dealUserId", referencedColumnName = "userId")
	public UserPO getDealUserPO(){
		return dealUserPO;
	}

	public void setDealUserPO(UserPO dealUserPO){
		this.dealUserPO = dealUserPO;
	}

	public Timestamp getDealTime(){
		return dealTime;
	}

	public void setDealTime(Timestamp dealTime){
		this.dealTime = dealTime;
	}

}
