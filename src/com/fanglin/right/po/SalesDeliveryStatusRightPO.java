package com.fanglin.right.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "salesdeliverystatusright", catalog = "platform")
public class SalesDeliveryStatusRightPO {

	public static final String COLUMN_BID_STR = "bid";

	public static final short STATUS_INIT_INT = 0;// 初始

	public static final short STATUS_DELIVERY_INT = 1;// 配送

	public static final short STATUS_CHECK_INT = 2;// 审核

	public static final short STATUS_NOTARIZE_INT = 3;// 确认

	public static final short STATUS_END_INT = 4;// 完结

	private long sdsrid;

	private String name;

	private long bid;

	private short status;

	private int company;

	@Id
	@GeneratedValue
	@Column(name = "sdsrid")
	public long getSdsrid() {
		return sdsrid;
	}

	public void setSdsrid(long sdsrid) {
		this.sdsrid = sdsrid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "bid")
	public long getBid() {
		return bid;
	}

	public void setBid(long bid) {
		this.bid = bid;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
