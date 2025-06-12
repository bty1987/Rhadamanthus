package com.fanglin.customer.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.customer.vo.FeedbackBackVisitVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "feedbackbackvisit", catalog = "customer")
public class FeedbackBackVisitPO implements Serializable {

	private static final long serialVersionUID = -8707304846094235558L;

	private long fbid;

	private long fid;

	private UserPO creater;

	private UserPO praiser;

	private short result;

	private short pleased;

	private short praiseType;

	private short openWords;

	private short contactSoonFlag;

	private short perforFlag;

	private short resultFlag;

	private short contactFlag;

	private int workDays;

	private Timestamp createTime;

	private Timestamp praiseTime;

	private Timestamp finishTime;

	private String complaint;

	private String praise;

	private String refuseComment;

	private String resultComment;

	public FeedbackBackVisitPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "fbid")
	public long getFbid() {
		return fbid;
	}

	public void setFbid(long fbid) {
		this.fbid = fbid;
	}

	@Column(name = "fid")
	public long getFid() {
		return fid;
	}

	public void setFid(long fid) {
		this.fid = fid;
	}

	@ManyToOne
	@JoinColumn(nullable = true, name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@ManyToOne
	@JoinColumn(nullable = true, name = "puid", referencedColumnName = "uid")
	public UserPO getPraiser() {
		return praiser;
	}

	public void setPraiser(UserPO praiser) {
		this.praiser = praiser;
	}

	@Column(name = "result")
	public short getResult() {
		return result;
	}

	public void setResult(short result) {
		this.result = result;
	}

	@Column(name = "pleased")
	public short getPleased() {
		return pleased;
	}

	public void setPleased(short pleased) {
		this.pleased = pleased;
	}

	@Column(name = "praiseType")
	public short getPraiseType() {
		return praiseType;
	}

	public void setPraiseType(short praiseType) {
		this.praiseType = praiseType;
	}

	@Column(name = "openWords")
	public short getOpenWords() {
		return openWords;
	}

	public void setOpenWords(short openWords) {
		this.openWords = openWords;
	}

	@Column(name = "contactSoonFlag")
	public short getContactSoonFlag() {
		return contactSoonFlag;
	}

	public void setContactSoonFlag(short contactSoonFlag) {
		this.contactSoonFlag = contactSoonFlag;
	}

	@Column(name = "perforFlag")
	public short getPerforFlag() {
		return perforFlag;
	}

	public void setPerforFlag(short perforFlag) {
		this.perforFlag = perforFlag;
	}

	@Column(name = "resultFlag")
	public short getResultFlag() {
		return resultFlag;
	}

	public void setResultFlag(short resultFlag) {
		this.resultFlag = resultFlag;
	}

	@Column(name = "contactFlag")
	public short getContactFlag() {
		return contactFlag;
	}

	public void setContactFlag(short contactFlag) {
		this.contactFlag = contactFlag;
	}

	@Column(name = "workDays")
	public int getWorkDays() {
		return workDays;
	}

	public void setWorkDays(int workDays) {
		this.workDays = workDays;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "praiseTime")
	public Timestamp getPraiseTime() {
		return praiseTime;
	}

	public void setPraiseTime(Timestamp praiseTime) {
		this.praiseTime = praiseTime;
	}

	@Column(name = "finishTime")
	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}

	@Column(name = "complaint")
	public String getComplaint() {
		return complaint;
	}

	public void setComplaint(String complaint) {
		this.complaint = complaint;
	}

	@Column(name = "praise")
	public String getPraise() {
		return praise;
	}

	public void setPraise(String praise) {
		this.praise = praise;
	}

	@Column(name = "refuseComment")
	public String getRefuseComment() {
		return refuseComment;
	}

	public void setRefuseComment(String refuseComment) {
		this.refuseComment = refuseComment;
	}

	@Column(name = "resultComment")
	public String getResultComment() {
		return resultComment;
	}

	public void setResultComment(String resultComment) {
		this.resultComment = resultComment;
	}

	public FeedbackBackVisitVO ptv(FeedbackBackVisitVO feedbackBackVisitVO) {

		BeanUtil.copyPropertie(this, feedbackBackVisitVO, Arrays.asList("creater", "praiser"));

		if (feedbackBackVisitVO.getCreater() != null && getCreater() != null) feedbackBackVisitVO.getCreater().setBaseInfo(getCreater());
		if (feedbackBackVisitVO.getPraiser() != null && getPraiser() != null) feedbackBackVisitVO.getPraiser().setBaseInfo(getPraiser());

		return feedbackBackVisitVO;
	}

}
