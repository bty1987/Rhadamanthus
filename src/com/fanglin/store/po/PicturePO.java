package com.fanglin.store.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "picture", catalog = "store")
public class PicturePO implements Serializable {

	private static final long serialVersionUID = -4319485471492418004L;

	public static final String COLUMN_PID_STR = "pid";

	public static final String COLUMN_GID_STR = "gid";

	public static final String COLUMN_TYPE_STR = "type";

	private long pid;

	private long gid;

	private String img;

	private short type;

	private short sort;

	public PicturePO() {
		super();
	}

	@Id
	@GeneratedValue
	@Column(name = "pid")
	public long getPid() {
		return pid;
	}

	public void setPid(long pid) {
		this.pid = pid;
	}

	@Column(name = "gid")
	public long getGid() {
		return gid;
	}

	public void setGid(long gid) {
		this.gid = gid;
	}

	@Column(name = "img")
	public String getImg() {
		return img;
	}

	public void setImg(String img) {
		this.img = img;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "sort")
	public short getSort() {
		return sort;
	}

	public void setSort(short sort) {
		this.sort = sort;
	}

}
