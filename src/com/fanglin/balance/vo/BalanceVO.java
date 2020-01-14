package com.fanglin.balance.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class BalanceVO implements Serializable{

	private static final long serialVersionUID = -8095741830980431347L;

	private Long bid;
	
	private String no;
	
	private UserBaseVO belonger;
	
	private UserBaseVO creater;
	
	private Timestamp createTime;
	
	private Long amount;
	
	private Long surplus;
	
	private Short type;
	
	private Short status;
	
	private Integer company;

	public BalanceVO() {
		super();
	}

	public BalanceVO(UserBaseVO belonger, UserBaseVO creater) {
		super();
		this.belonger = belonger;
		this.creater = creater;
	}

	public Long getBid() {
		return bid;
	}

	public void setBid(Long bid) {
		this.bid = bid;
	}
	
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public UserBaseVO getBelonger() {
		return belonger;
	}

	public void setBelonger(UserBaseVO belonger) {
		this.belonger = belonger;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Long getAmount() {
		return amount;
	}

	public void setAmount(Long amount) {
		this.amount = amount;
	}
	
	public Long getSurplus() {
		return surplus;
	}

	public void setSurplus(Long surplus) {
		this.surplus = surplus;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}
	
}
