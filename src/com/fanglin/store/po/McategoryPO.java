package com.fanglin.store.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "mcategory", catalog = "store")
public class McategoryPO implements Serializable {

	private static final long serialVersionUID = -4328485362492429004L;

	public static final String COLUMN_CID_STR = "cid";

	public static final short SHOW_INIT_SHORT = 0;

	public static final short SHOW_DISPLAY_SHORT = 1;

	private long cid;

	private String name;

	private String icon;

	private short isShow;

	public McategoryPO() {
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

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "icon")
	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	@Column(name = "isShow")
	public short getIsShow() {
		return isShow;
	}

	public void setIsShow(short isShow) {
		this.isShow = isShow;
	}

}
