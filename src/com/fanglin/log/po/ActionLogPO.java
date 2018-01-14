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

package com.fanglin.log.po;

import static javax.persistence.GenerationType.IDENTITY;

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
@Table(name = "actionLog", catalog = "log")
public class ActionLogPO implements Serializable {

	private static final long serialVersionUID = -1714740524313501162L;
	
	private long alId;
	
	private String actionName;
	
	private UserPO createUserPO;
	
	private Timestamp  createTime;
	
	private long runTime;
	
	public ActionLogPO(){
		super();
	}

	public ActionLogPO(String actionName, UserPO createUserPO, Timestamp createTime, long runTime){
		super();
		this.actionName = actionName;
		this.createUserPO = createUserPO;
		this.createTime = createTime;
		this.runTime = runTime;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "alId")
	public long getAlId() {
		return alId;
	}

	public void setAlId(long alId) {
		this.alId = alId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "createUserId", referencedColumnName = "userId")
	public UserPO getCreateUserPO(){
		return createUserPO;
	}
	
	public void setCreateUserPO(UserPO createUserPO){
		this.createUserPO = createUserPO;
	}
	
	@Column(name = "createTime")
	public Timestamp getCreateTime(){
		return createTime;
	}
	
	public void setCreateTime(Timestamp createTime){
		this.createTime = createTime;
	}
	
	@Column(name = "actionName")
	public void setActionName(String actionName){
		this.actionName = actionName;
	}
	
	public String getActionName(){
		return actionName;
	}

	@Column(name = "runTime")
	public long getRunTime(){
		return runTime;
	}

	public void setRunTime(long runTime){
		this.runTime = runTime;
	}	
}
