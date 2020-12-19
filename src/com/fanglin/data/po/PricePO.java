package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "price", catalog = "inventory")
public class PricePO implements Serializable {

	private static final long serialVersionUID = -3508364908423803950L;

	public static final String COLUMN_PID_STR = "pid";

	public static final String COLUMN_GID_STR = "gid";
	
	public static final String COLUMN_STATUS_STR = "status";

	public static final short CTYPE_ENABLE_INT = 0;

	public static final short CTYPE_DISABLE_INT = 1;
	
	public static final short STATUS_ENABLE_INT = 0;

	public static final short STATUS_DISABLE_INT = 1;
	
	private long pid;

	private long gid;

	private String name;

	private short type;

	private int purchase;

	private int selling;

	private short ctype;

	private int cvalue;
	
	private short status;

	@Id
	@GeneratedValue(strategy = IDENTITY)
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

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "purchase")
	public int getPurchase() {
		return purchase;
	}

	public void setPurchase(int purchase) {
		this.purchase = purchase;
	}

	@Column(name = "selling")
	public int getSelling() {
		return selling;
	}

	public void setSelling(int selling) {
		this.selling = selling;
	}

	@Column(name = "ctype")
	public short getCtype() {
		return ctype;
	}
	
	public void setCtype(short ctype) {
		this.ctype = ctype;
	}

	@Column(name = "cvalue")
	public int getCvalue() {
		return cvalue;
	}

	public void setCvalue(int cvalue) {
		this.cvalue = cvalue;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

}
