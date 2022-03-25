package com.fanglin.customer.vo;

import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class ApprovalVO implements java.io.Serializable {

	private static final long serialVersionUID = 681244422042709487L;

	private Long aid;

	private Short type;

	private Short status;

	private Timestamp createTime;

	private Timestamp approvalTime;

	private String contents;

	private String comment;

	private String annotate;

	public ApprovalVO() {
		super();
	}

	public Long getAid() {
		return this.aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
	}

	public Short getType() {
		return this.type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getStatus() {
		return this.status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getApprovalTime() {
		return approvalTime;
	}

	public void setApprovalTime(Timestamp approvalTime) {
		this.approvalTime = approvalTime;
	}

	public String getContents() {
		return this.contents;
	}

	public void setContents(String contents) {
		this.contents = contents;
	}

	public String getComment() {
		return this.comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public String getAnnotate() {
		return annotate;
	}

	public void setAnnotate(String annotate) {
		this.annotate = annotate;
	}

}