package com.fanglin.inventory.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;


import com.fanglin.personel.vo.UserBaseVO;

public class PurchaseBalanceVO implements Serializable{

	private static final long serialVersionUID = 2555399710758622509L;

	private Long pbid;
	
	private Long pid;
	
	private UserBaseVO creater;
	
	private Timestamp createTime;
	
	private Long balance;
	
	private Short status;
	
	private String comment;
	
	public PurchaseBalanceVO() {
		super();
	}

	public PurchaseBalanceVO(UserBaseVO creater) {
		super();
		this.creater = creater;
	}

	public Long getPbid() {
		return pbid;
	}

	public void setPbid(Long pbid) {
		this.pbid = pbid;
	}

	public Long getPid() {
		return pid;
	}

	public void setPid(Long pid) {
		this.pid = pid;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Long getBalance() {
		return balance;
	}

	public void setBalance(Long balance) {
		this.balance = balance;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
