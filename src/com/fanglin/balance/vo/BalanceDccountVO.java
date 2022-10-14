package com.fanglin.balance.vo;

import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class BalanceDccountVO implements java.io.Serializable {

	private static final long serialVersionUID = -2046781831270031498L;

	private Long bdid;

	private String name;

	private UserBaseVO creater;

	private UserBaseVO belonger;

	private Timestamp createTime;

	private Timestamp startTime;

	private Timestamp endTime;

	private Long cutpay;

	private Long surplus;

	private Short type;

	private Short status;

	private String comment;

	public BalanceDccountVO() {
		super();
	}

	public BalanceDccountVO(UserBaseVO belonger, UserBaseVO creater) {
		super();
		this.belonger = belonger;
		this.creater = creater;
	}

	public Long getBdid() {
		return bdid;
	}

	public void setBdid(Long bdid) {
		this.bdid = bdid;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getStartTime() {
		return startTime;
	}

	public void setStartTime(Timestamp startTime) {
		this.startTime = startTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getEndTime() {
		return endTime;
	}

	public void setEndTime(Timestamp endTime) {
		this.endTime = endTime;
	}

	public Long getSurplus() {
		return surplus;
	}

	public void setSurplus(Long surplus) {
		this.surplus = surplus;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Long getCutpay() {
		return cutpay;
	}

	public void setCutpay(Long cutpay) {
		this.cutpay = cutpay;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public UserBaseVO getBelonger() {
		return belonger;
	}

	public void setBelonger(UserBaseVO belonger) {
		this.belonger = belonger;
	}


}
