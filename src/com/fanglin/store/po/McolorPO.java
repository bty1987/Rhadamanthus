package com.fanglin.store.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "mcolor", catalog = "store")
public class McolorPO implements Serializable {

	private static final long serialVersionUID = 8202883119458806724L;

	public static final String COLUMN_GID_STR = "mgoods.gid";
	
	public static final String COLUMN_CID_STR = "cid";
	
	public static final short STATUS_ABLE_SHORT = 0;
	
	public static final short STATUS_DISABLE_SHORT = 1;

	private long cid;

	private MgoodsPO mgoods;

	private String color;

	private short status;

	public McolorPO() {
		super();
	}
	
	public McolorPO(MgoodsPO mgoods) {
		super();
		this.mgoods = mgoods;
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
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "gid", referencedColumnName="gid")
	public MgoodsPO getMgoods() {
		return mgoods;
	}

	public void setMgoods(MgoodsPO mgoods) {
		this.mgoods = mgoods;
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
