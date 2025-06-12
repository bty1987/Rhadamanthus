package com.fanglin.customer.po;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.utils.DateUtil;

@Entity
@Table(name = "feedbackDrawing", catalog = "customer")
public class FeedbackDrawingPO implements Serializable {

	private static final long serialVersionUID = 2063884152883156712L;

	public static final String COLUMN_STATUS_STR = "status";

	public static final short STATUS_INIT_SHORT = 0;

	private long fdid;

	private long fid;

	private long sid;

	private String path;

	private Timestamp createTime;

	private short type;

	private short status;

	public FeedbackDrawingPO() {
		super();
	}

	public FeedbackDrawingPO(long fid, String path) {

		super();

		this.fid = fid;
		this.path = path;

		this.status = STATUS_INIT_SHORT;
		this.createTime = DateUtil.getDateToTimestamp(new Date());
	}

	@Id
	@GeneratedValue
	@Column(name = "fdid")
	public long getFdid() {
		return fdid;
	}

	public void setFdid(long fdid) {
		this.fdid = fdid;
	}

	@Column(name = "fid")
	public long getFid() {
		return fid;
	}

	public void setFid(long fid) {
		this.fid = fid;
	}

	@Column(name = "sid")
	public long getSid() {
		return sid;
	}

	public void setSid(long sid) {
		this.sid = sid;
	}

	@Column(name = "path")
	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

}
