package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class FeedbackRecordVO implements Serializable {

	private static final long serialVersionUID = -6929197765043316651L;

	private long fbrid;

	private FeedbackVO feedback;

	private UserBaseVO handler;

	private Timestamp operateTime;

	private String comment;

	public FeedbackRecordVO() {
		super();
	}

	public FeedbackRecordVO(UserBaseVO handler, FeedbackVO feedback) {
		super();
		this.handler = handler;
		this.feedback = feedback;
	}

	public long getFbrid() {
		return fbrid;
	}

	public void setFbrid(long fbrid) {
		this.fbrid = fbrid;
	}

	public FeedbackVO getFeedback() {
		return feedback;
	}

	public void setFeedback(FeedbackVO feedback) {
		this.feedback = feedback;
	}

	public UserBaseVO getHandler() {
		return handler;
	}

	public void setHandler(UserBaseVO handler) {
		this.handler = handler;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
