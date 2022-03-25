package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class RepairpayVO implements Serializable {

	private static final long serialVersionUID = 4284891954704137097L;

	private Long rpid;

	private Long aid;

	private Short type;

	private Long ident;

	private Long money;

	private UserBaseVO creater;

	private Timestamp createTime;

	private Short status;

	public RepairpayVO() {
		super();
	}

	public RepairpayVO(UserBaseVO creater) {
		super();
		this.creater = creater;
	}

	public Long getRpid() {
		return rpid;
	}

	public void setRpid(Long rpid) {
		this.rpid = rpid;
	}

	public Long getAid() {
		return aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Long getIdent() {
		return ident;
	}

	public void setIdent(Long ident) {
		this.ident = ident;
	}

	public Long getMoney() {
		return money;
	}

	public void setMoney(Long money) {
		this.money = money;
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

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}
