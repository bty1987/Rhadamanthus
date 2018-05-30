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
@Table(name = "mformat", catalog = "store")
public class MformatPO implements Serializable {

	private static final long serialVersionUID = -3873646957052842185L;

	public static final String COLUMN_GID_STR = "mgoods.gid";
	
	public static final Short STATUS_ABLE_SHORT = 0;

	public static final Short STATUS_DISABLE_SHORT = 1;

	private long fid;
	
	private MgoodsPO mgoods;

	private String format;

	private short status;

	public MformatPO() {
		super();
	}

	public MformatPO(MgoodsPO mgoods) {
		super();
		this.mgoods = mgoods;
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
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "gid", referencedColumnName = "gid")
	public MgoodsPO getMgoods() {
		return mgoods;
	}

	public void setMgoods(MgoodsPO mgoods) {
		this.mgoods = mgoods;
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
