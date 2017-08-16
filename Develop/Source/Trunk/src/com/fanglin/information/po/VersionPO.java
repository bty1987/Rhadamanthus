package com.fanglin.information.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "version", catalog = "upgrade")
public class VersionPO implements Serializable{

	private static final long serialVersionUID = -3482372700667296973L;
	
	public static final String COLUMN_NO_STR = "no";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final short STATUS_ENABLED_INT = 0;
	
	public static final short STATUS_DISABLED_INT = 1;
	
	private long vid;
	
	private String no;
	
	private Timestamp createTime;
	
	private String comment;
	
	private short status;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "vid")
	public long getVid() {
		return vid;
	}

	public void setVid(long vid) {
		this.vid = vid;
	}
	
	@Column(name = "no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
	
	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
	
}
