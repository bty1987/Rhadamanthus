package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class CustomerSourceRecordVO implements Serializable {

	private static final long serialVersionUID = 2398972944028317523L;

	private Long csrid;

	private Long csid;

	private Long ccid;

	private Short type;

	private UserBaseVO operater;

	private Timestamp operatTime;

	private String comment;

	public CustomerSourceRecordVO() {
		super();
	}

	public CustomerSourceRecordVO(UserBaseVO operater) {
		super();
		this.operater = operater;
	}

	public Long getCsrid() {
		return csrid;
	}

	public void setCsrid(Long csrid) {
		this.csrid = csrid;
	}

	public Long getCsid() {
		return csid;
	}

	public void setCsid(Long csid) {
		this.csid = csid;
	}

	public Long getCcid() {
		return ccid;
	}

	public void setCcid(Long ccid) {
		this.ccid = ccid;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public UserBaseVO getOperater() {
		return operater;
	}

	public void setOperater(UserBaseVO operater) {
		this.operater = operater;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getOperatTime() {
		return operatTime;
	}

	public void setOperatTime(Timestamp operatTime) {
		this.operatTime = operatTime;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
}
