package com.fanglin.sales.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import com.fanglin.personel.po.UserPO;

public class RefundsVO  implements Serializable{
	private static final long serialVersionUID = 5543447445422987680L;
	
	private Long rid;
	
	private Long sid;
	
	private Long spid;
	
	private Float total;
	
	private Short status;
	
	private UserPO creater;
	
	private String comment;
	
	private Timestamp createTime;
	 
	private Timestamp balanceTime;

	public Long getRid() {
		return rid;
	}

	public void setRid(Long rid) {
		this.rid = rid;
	}

	public Long getSid() {
		return sid;
	}

	public void setSid(Long sid) {
		this.sid = sid;
	}

	public Long getSpid() {
		return spid;
	}

	public void setSpid(Long spid) {
		this.spid = spid;
	}

	public Float getTotal() {
		return total;
	}

	public void setTotal(Float total) {
		this.total = total;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Timestamp getBalanceTime() {
		return balanceTime;
	}

	public void setBalanceTime(Timestamp balanceTime) {
		this.balanceTime = balanceTime;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
	
}
