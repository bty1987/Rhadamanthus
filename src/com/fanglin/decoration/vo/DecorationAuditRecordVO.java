package com.fanglin.decoration.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import com.fanglin.personel.vo.UserVO;

public class DecorationAuditRecordVO implements Serializable{

	private static final long serialVersionUID = -5288629146839850025L;

	private Long arid;

	private DecorationAuditVO audit;

	private String comment;

	private Long unitprice;

	private Long num;

	private Long discount;

	private UserVO creater;

	private Timestamp createTime;

	private Integer status;

	public DecorationAuditRecordVO() {
		super();
	}

	public DecorationAuditRecordVO(DecorationAuditVO audit) {
		super();
		this.audit = audit;
	}

	public Long getArid() {
		return arid;
	}

	public void setArid(Long arid) {
		this.arid = arid;
	}

	public DecorationAuditVO getAudit() {
		return audit;
	}

	public void setAudit(DecorationAuditVO audit) {
		this.audit = audit;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Long getUnitprice() {
		return unitprice;
	}

	public void setUnitprice(Long unitprice) {
		this.unitprice = unitprice;
	}

	public Long getNum() {
		return num;
	}

	public void setNum(Long num) {
		this.num = num;
	}

	public Long getDiscount() {
		return discount;
	}

	public void setDiscount(Long discount) {
		this.discount = discount;
	}

	public UserVO getCreater() {
		return creater;
	}

	public void setCreater(UserVO creater) {
		this.creater = creater;
	}

	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

}
