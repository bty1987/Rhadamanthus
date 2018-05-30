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
@Table(name = "slide", catalog = "store")
public class SlidePO implements Serializable {
	
	private static final long serialVersionUID = -3415046371108862977L;
	
	public static final String COLUMN_SID_STR = "sid";
	
	public static final String COLUMN_GID_STR = "mgoods.gid";
	
	public static final short STATUS_ABLE_SHORT = 0;
	
	public static final short STATUS_DISABLE_SHORT = 1;

	private long sid;
	
	private MgoodsPO mgoods;
	
	private String img;
	
	private String url;
	
	private short status;

	public SlidePO() {
		super();
	}

	public SlidePO(MgoodsPO mgoods) {
		super();
		this.mgoods = mgoods;
	}

	@Id
	@GeneratedValue
	@Column(name = "sid")
	public long getSid() {
		return sid;
	}

	public void setSid(long sid) {
		this.sid = sid;
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

	@Column(name="url")
	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	@Column(name="status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
}
