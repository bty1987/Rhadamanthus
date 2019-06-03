package com.fanglin.construction.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "ConstructIoninfo", catalog = "construction")
public class ConstructionInfoPO implements Serializable {

	private static final long serialVersionUID = -8887915345535064194L;

	public static final String COLUMN_CIID_STR = "ciid";

	public static final String COLUMN_CID_STR = "cid";

	public static final String COLUMN_ORDERID_STR = "orderId";

	private long ciid;
	
	private String orderId;

	private long cid;

	private short ishovel;

	private short iskey;

	private short isCeremony;

	private String comment;

	public ConstructionInfoPO() {
		super();
	}

	public ConstructionInfoPO(long cid, short ishovel, short iskey, short isCeremony, String comment, String orderId) {
		super();
		this.cid = cid;
		this.ishovel = ishovel;
		this.iskey = iskey;
		this.isCeremony = isCeremony;
		this.comment = comment;
		this.orderId = orderId;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ciid")
	public long getCiid() {
		return ciid;
	}

	public void setCiid(long ciid) {
		this.ciid = ciid;
	}
	
	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "cid")
	public long getCid() {
		return cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
	}

	@Column(name = "ishovel")
	public short getIshovel() {
		return ishovel;
	}

	@Column(name = "ishovel")
	public void setIshovel(short ishovel) {
		this.ishovel = ishovel;
	}

	@Column(name = "iskey")
	public short getIskey() {
		return iskey;
	}

	public void setIskey(short iskey) {
		this.iskey = iskey;
	}

	@Column(name = "isCeremony")
	public short getIsCeremony() {
		return isCeremony;
	}

	public void setIsCeremony(short isCeremony) {
		this.isCeremony = isCeremony;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	
}
