package com.fanglin.decoration.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import com.fanglin.personel.vo.UserVO;

public class AuditRecordVO implements Serializable{

	private static final long serialVersionUID = -5288629146839850025L;
	
	private Long arid;
	
	private AuditVO audit;
	
	private String comment;
	
	private Float unitprice;
	
	private Float num;
	
	private Float discount;
	
	private UserVO creater;
	
	private Timestamp createTime;
	
	private Integer status;

	public AuditRecordVO() {
		super();
	}

	public AuditRecordVO(AuditVO audit) {
		super();
		this.audit = audit;
	}

	public Long getArid() {
		return arid;
	}

	public void setArid(Long arid) {
		this.arid = arid;
	}

	public AuditVO getAudit() {
		return audit;
	}

	public void setAudit(AuditVO audit) {
		this.audit = audit;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Float getUnitprice() {
		return unitprice;
	}

	public void setUnitprice(Float unitprice) {
		this.unitprice = unitprice;
	}

	public Float getNum() {
		return num;
	}

	public void setNum(Float num) {
		this.num = num;
	}

	public Float getDiscount() {
		return discount;
	}

	public void setDiscount(Float discount) {
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