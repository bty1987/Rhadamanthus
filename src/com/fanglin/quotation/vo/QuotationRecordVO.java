package com.fanglin.quotation.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class QuotationRecordVO implements Serializable {

	private static final long serialVersionUID = 2995388699420722787L;

	private Long qrid;

	private Long qid;

	private Short type;

	private UserBaseVO operater;

	private Timestamp operatTime;

	private String comment;

	public QuotationRecordVO() {
		super();
	}

	public QuotationRecordVO(UserBaseVO operater) {
		super();
		this.operater = operater;
	}

	public Long getQrid() {
		return qrid;
	}

	public void setQrid(Long qrid) {
		this.qrid = qrid;
	}

	public Long getQid() {
		return qid;
	}

	public void setQid(Long qid) {
		this.qid = qid;
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
