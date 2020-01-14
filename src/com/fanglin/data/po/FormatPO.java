package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "format", catalog = "inventory")
public class FormatPO implements Serializable {

	private static final long serialVersionUID = -260512360916421162L;

	public static final String COLUMN_GID_STR = "gid";

	public static final String COLUMN_INFO_STR = "info";

	public static final String COLUMN_STATUS_STR = "status";

	public static final short STATUS_ENABLE_INT = 0;

	public static final short STATUS_DISABLE_INT = 1;

	private long fid;

	private long gid;

	private String info;

	private short status;

	public FormatPO() {
		super();
	}

	public FormatPO(Long fid) {
		super();
		this.fid = fid;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
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

	@Column(name = "info")
	public String getInfo() {
		return info;
	}

	public void setInfo(String info) {
		this.info = info;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

}
