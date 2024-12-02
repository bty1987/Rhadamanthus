package com.fanglin.customer.po;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.customer.vo.FeedbackRecordVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "feedbackrecord", catalog = "customer")
public class FeedbackRecordPO implements Serializable {

	private static final long serialVersionUID = -4913298852355057879L;

	public static final String COLUMN_RECORD_FBID = "feedbackrecord.fbid";

	private long fbrid;

	private FeedbackPO feedback;

	private UserPO handler;

	private Timestamp operateTime;

	private String comment;

	@Id
	@GeneratedValue
	@Column(name = "fbrid")
	public long getFbrid() {
		return fbrid;
	}

	public void setFbrid(long fbrid) {
		this.fbrid = fbrid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "fbid", referencedColumnName = "fid")
	public FeedbackPO getFeedback() {
		return feedback;
	}

	public void setFeedback(FeedbackPO feedback) {
		this.feedback = feedback;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "ouid", referencedColumnName = "uId")
	public UserPO getHandler() {
		return handler;
	}

	public void setHandler(UserPO handler) {
		this.handler = handler;
	}

	@Column(name = "operateTime")
	public Timestamp getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public FeedbackRecordVO ptv(FeedbackRecordVO feedbackRecordVO) {

		BeanUtil.copyPropertie(this, feedbackRecordVO, Arrays.asList("feedback", "handler"));

		if (feedbackRecordVO.getHandler() != null) feedbackRecordVO.getHandler().ptv(getHandler());

		if (feedbackRecordVO.getFeedback() != null) getFeedback().ptv(feedbackRecordVO.getFeedback());

		return feedbackRecordVO;
	}

}
