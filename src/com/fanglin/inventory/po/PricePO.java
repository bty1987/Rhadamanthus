package com.fanglin.inventory.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
@Entity
@Table(name = "price", catalog = "inventory")
public class PricePO implements Serializable{

	private static final long serialVersionUID = -3508364908423803950L;
	
	public static final String COLUMN_PID_STR ="pid";
	
	public static final String COLUMN_GID_STR = "gid";
	
	public static final String COLUMN_SELLING_STR = "selling";
	
	public static final String COLUMN_CTYPE_STR = "ctype";
	
	public static final short CTYPE_ENABLE_INT = 0;
	
	public static final short CTYPE_DISABLE_INT = 1;

	private long pid;
	
	private long gid;
	
	private String name;
	
	private float purchase;
	
	private float selling;
	
	private short ctype;
	
	private float cvalue;
	
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
	
	@Column(name = "purchase")
	public float getPurchase() {
		return purchase;
	}

	public void setPurchase(float purchase) {
		this.purchase = purchase;
	}
	
	@Column(name = "selling")
	public float getSelling() {
		return selling;
	}

	public void setSelling(float selling) {
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
	public float getCvalue() {
		return cvalue;
	}

	public void setCvalue(float cvalue) {
		this.cvalue = cvalue;
	}
	
}
