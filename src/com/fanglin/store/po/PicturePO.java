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
@Table(name="picture", catalog = "store")
public class PicturePO implements Serializable{
	
	private static final long serialVersionUID = -4319485471492418004L;
	
	public static final String COLUMN_PID_STR = "pid";
	
	public static final String COLUMN_GID_STR = "mgoods.gid";
	
	public static final String COLUMN_TYPE_STR = "type";
	
	public static final short STATUS_ABLE_SHORT = 0;
	
	public static final short STATUS_DISABLE_SHORT = 1;
	
	private long pid;
	
	private MgoodsPO mgoods;
	
	private String img;
	
	private short type;
	
	private short status;
	
	private short sort;

	public PicturePO() {
		super();
	}

	public PicturePO(MgoodsPO mgoods) {
		super();
		this.mgoods = mgoods;
	}

	@Id
	@GeneratedValue
	@Column(name="pid")
	public long getPid() {
		return pid;
	}

	public void setPid(long pid) {
		this.pid = pid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "gid", referencedColumnName="gid")
	public MgoodsPO getMgoods() {
		return mgoods;
	}

	public void setMgoods(MgoodsPO mgoods) {
		this.mgoods = mgoods;
	}

	@Column(name="img")
	public String getImg() {
		return img;
	}

	public void setImg(String img) {
		this.img = img;
	}

	@Column(name="type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name="status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name="sort")
	public short getSort() {
		return sort;
	}

	public void setSort(short sort) {
		this.sort = sort;
	}
	
}
