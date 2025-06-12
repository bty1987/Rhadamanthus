package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class FeedbackBackVisitVO implements Serializable {

	private static final long serialVersionUID = -1612322340120270199L;

	private Long fbid;

	private Long fid;

	private UserBaseVO praiser;

	private UserBaseVO creater;

	private Short result;

	private Short pleased;

	private Short praiseType;

	private Short openWords;

	private Short contactSoonFlag;

	private Short perforFlag;

	private Short resultFlag;

	private Short contactFlag;

	private Integer workDays;

	private Timestamp createTime;

	private Timestamp praiseTime;

	private Timestamp finishTime;

	private String complaint;

	private String praise;

	private String refuseComment;

	private String resultComment;

	public FeedbackBackVisitVO() {
		super();
	}

	public FeedbackBackVisitVO(UserBaseVO praiser, UserBaseVO creater) {
		super();
		this.praiser = praiser;
		this.creater = creater;
	}

	public Long getFbid() {
		return fbid;
	}

	public void setFbid(Long fbid) {
		this.fbid = fbid;
	}

	public Long getFid() {
		return fid;
	}

	public void setFid(Long fid) {
		this.fid = fid;
	}

	public UserBaseVO getPraiser() {
		return praiser;
	}

	public void setPraiser(UserBaseVO praiser) {
		this.praiser = praiser;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	public Short getResult() {
		return result;
	}

	public void setResult(Short result) {
		this.result = result;
	}

	public Short getPleased() {
		return pleased;
	}

	public void setPleased(Short pleased) {
		this.pleased = pleased;
	}

	public Short getPraiseType() {
		return praiseType;
	}

	public void setPraiseType(Short praiseType) {
		this.praiseType = praiseType;
	}

	public Short getOpenWords() {
		return openWords;
	}

	public void setOpenWords(Short openWords) {
		this.openWords = openWords;
	}

	public Short getContactSoonFlag() {
		return contactSoonFlag;
	}

	public void setContactSoonFlag(Short contactSoonFlag) {
		this.contactSoonFlag = contactSoonFlag;
	}

	public Short getPerforFlag() {
		return perforFlag;
	}

	public void setPerforFlag(Short perforFlag) {
		this.perforFlag = perforFlag;
	}

	public Short getResultFlag() {
		return resultFlag;
	}

	public void setResultFlag(Short resultFlag) {
		this.resultFlag = resultFlag;
	}

	public Short getContactFlag() {
		return contactFlag;
	}

	public void setContactFlag(Short contactFlag) {
		this.contactFlag = contactFlag;
	}

	public Integer getWorkDays() {
		return workDays;
	}

	public void setWorkDays(Integer workDays) {
		this.workDays = workDays;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getPraiseTime() {
		return praiseTime;
	}

	public void setPraiseTime(Timestamp praiseTime) {
		this.praiseTime = praiseTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}

	public String getComplaint() {
		return complaint;
	}

	public void setComplaint(String complaint) {
		this.complaint = complaint;
	}

	public String getPraise() {
		return praise;
	}

	public void setPraise(String praise) {
		this.praise = praise;
	}

	public String getRefuseComment() {
		return refuseComment;
	}

	public void setRefuseComment(String refuseComment) {
		this.refuseComment = refuseComment;
	}

	public String getResultComment() {
		return resultComment;
	}

	public void setResultComment(String resultComment) {
		this.resultComment = resultComment;
	}

}
