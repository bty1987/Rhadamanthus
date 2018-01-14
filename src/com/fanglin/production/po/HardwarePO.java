package com.fanglin.production.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "hardware" , catalog = "production")
public class HardwarePO implements Serializable{

	private static final long serialVersionUID = 7448276950774568288L;

	public static final short STATUS_NOTARRIVAL_SHORT = 0; //未到货
	
	public static final short STATUS_ARRIVED_SHORT = 1;   //已到货
	
	public static final short STATUS_DESTROY_SHORT = 2; //废弃
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final String COLUMN_HID_STR = "hid";
	
	public static final String COLUMN_PID_STR = "pid";
	
	private long hid;
	
	private long pid;
	
	private short status;
	
	private String path;
	
	private String comment;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "hid")
	public long getHid() {
		return hid;
	}

	public void setHid(long hid) {
		this.hid = hid;
	}

	@Column(name = "pid")
	public long getPid() {
		return pid;
	}

	public void setPid(long pid) {
		this.pid = pid;
	}
	
	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
	
	@Column(name = "path")
	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}
	
	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
