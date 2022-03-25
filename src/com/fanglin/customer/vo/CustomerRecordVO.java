package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class CustomerRecordVO implements Serializable {

	private static final long serialVersionUID = 2398972944028317523L;

	private Long crid;

	private Long csid;

	private String comment;

	private Short type;

	private UserBaseVO operater;

	private Timestamp operatTime;

	public CustomerRecordVO() {
		super();
	}

	public CustomerRecordVO(UserBaseVO operater) {
		super();
		this.operater = operater;
	}

	public Long getCrid() {
		return crid;
	}

	public void setCrid(Long crid) {
		this.crid = crid;
	}

	public Long getCsid() {
		return csid;
	}

	public void setCsid(Long csid) {
		this.csid = csid;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
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

}
