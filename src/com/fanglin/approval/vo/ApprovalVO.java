package com.fanglin.approval.vo;

import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class ApprovalVO implements java.io.Serializable {

	private static final long serialVersionUID = -1448433204227173452L;

	private Long aid;

	private UserBaseVO receiver;

	private UserBaseVO sender;

	private Short type;

	private Short status;

	private Timestamp createTime;

	private Timestamp approvalTime;

	private String contents;

	private String comment;

	private String annotate;

	private String processinstanceid;

	public ApprovalVO() {
		super();
	}

	public ApprovalVO(UserBaseVO receiver, UserBaseVO sender) {
		super();
		this.receiver = receiver;
		this.sender = sender;
	}

	public Long getAid() {
		return this.aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
	}

	public UserBaseVO getReceiver() {
		return receiver;
	}

	public void setReceiver(UserBaseVO receiver) {
		this.receiver = receiver;
	}

	public UserBaseVO getSender() {
		return sender;
	}

	public void setSender(UserBaseVO sender) {
		this.sender = sender;
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
		return this.approvalTime;
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

	public String getProcessinstanceid() {
		return processinstanceid;
	}

	public void setProcessinstanceid(String processinstanceid) {
		this.processinstanceid = processinstanceid;
	}

}