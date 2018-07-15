package com.fanglin.store.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "mcolor", catalog = "store")
public class McolorPO implements Serializable {

	private static final long serialVersionUID = 8202883119458806724L;

	public static final String COLUMN_GID_STR = "gid";
	
	public static final String COLUMN_CID_STR = "cid";
	
	public static final short STATUS_ABLE_SHORT = 0;

	private long cid;

	private long gid;

	private String color;

	private short status;

	public McolorPO() {
		super();
	}
	
	@Id
	@GeneratedValue
	@Column(name = "cid")
	public long getCid() {
		return cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
	}
	
	@Column(name = "gid")
	public long getGid() {
		return gid;
	}

	public void setGid(long gid) {
		this.gid = gid;
	}

	@Column(name = "color")
	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}
	
	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
}
