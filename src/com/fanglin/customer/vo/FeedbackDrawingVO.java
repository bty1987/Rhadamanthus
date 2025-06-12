package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

public class FeedbackDrawingVO implements Serializable {

	private static final long serialVersionUID = -5839037335658757203L;

	private Long fdid;

	private Long fid;

	private Long sid;

	private String path;

	private Timestamp createTime;

	private Short type;

	private Short status;
	
	private String fdids;

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

	public Long getSid() {
		return sid;
	}

	public void setSid(Long sid) {
		this.sid = sid;
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

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public String getFdids() {
		return fdids;
	}

	public void setFdids(String fdids) {
		this.fdids = fdids;
	}

	
}
