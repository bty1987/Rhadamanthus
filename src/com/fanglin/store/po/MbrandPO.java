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
@Table(name = "mbrand", catalog = "store")
public class MbrandPO implements Serializable {

	private static final long serialVersionUID = -4319485351492429004L;

	public static final String COLUMN_BID_STR = "bid";

	public static final String COLUMN_CID_STR = "mcategory.cid";

	public static final String COLUMN_NAME_STR = "name";

	public static final short STATUS_ABLE_SHORT = 0;

	public static final short STATUS_DISABLE_SHORT = 1;

	private long bid;

	private McategoryPO mcategory;

	private String name;

	private String icon;

	private short status;

	public MbrandPO() {
		super();
	}

	public MbrandPO(McategoryPO mcategory) {
		super();
		this.mcategory = mcategory;
	}

	@Id
	@GeneratedValue
	@Column(name = "bid")
	public long getBid() {
		return bid;
	}

	public void setBid(long bid) {
		this.bid = bid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cid", referencedColumnName = "cid")
	public McategoryPO getMcategory() {
		return mcategory;
	}

	public void setMcategory(McategoryPO mcategory) {
		this.mcategory = mcategory;
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

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

}
