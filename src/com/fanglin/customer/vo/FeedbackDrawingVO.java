package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

public class FeedbackDrawingVO implements Serializable {

	private static final long serialVersionUID = -5839037335658757203L;

	private Long fdid;

	private Long fid;

	private String path;

	private Timestamp createTime;

	private Short status;

	public FeedbackDrawingVO() {
		super();
	}

	public Long getFdid() {
		return fdid;
	}

	public void setFdid(Long fdid) {
		this.fdid = fdid;
	}

	public Long getFid() {
		return fid;
	}

	public void setFid(Long fid) {
		this.fid = fid;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}
