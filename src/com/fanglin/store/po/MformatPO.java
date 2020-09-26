package com.fanglin.store.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "mformat", catalog = "store")
public class MformatPO implements Serializable {

	private static final long serialVersionUID = -3873646957052842185L;

	public static final String COLUMN_GID_STR = "gid";

	public static final Short STATUS_ABLE_SHORT = 0;

	public static final Short STATUS_DISABLE_SHORT = 1;

	private long fid;

	private long gid;

	private String format;

	private short status;

	public MformatPO() {
		super();
	}

	@Id
	@GeneratedValue
	@Column(name = "fid")
	public long getFid() {
		return fid;
	}

	public void setFid(long fid) {
		this.fid = fid;
	}

	@Column(name = "gid")
	public long getGid() {
		return gid;
	}

	public void setGid(long gid) {
		this.gid = gid;
	}

	@Column(name = "format")
	public String getFormat() {
		return format;
	}

	public void setFormat(String format) {
		this.format = format;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

}
