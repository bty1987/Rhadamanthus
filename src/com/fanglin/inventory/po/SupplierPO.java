package com.fanglin.inventory.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="supplier", catalog="inventory")
public class SupplierPO implements Serializable{

	private static final long serialVersionUID = -6791966038934885721L;
	
	public static final String COLUMN_GID_STR = "gid";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final String COLUMN_NAME_STR = "name";
	
	public static final short STATUS_ENABLE_INT = 0;

	private long sid;
	
	private long gid;
	
	private String name;
	
	private short status;

	public SupplierPO() {
		super();
	}

	public SupplierPO(long sid) {
		super();
		this.sid = sid;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "sid")
	public long getSid() {
		return sid;
	}

	public void setSid(long sid) {
		this.sid = sid;
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
	
	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
}
