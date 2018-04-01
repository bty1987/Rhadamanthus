package com.fanglin.production.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "productionsales", catalog = "production")
public class ProductionSalesPO implements Serializable {

	private static final long serialVersionUID = -8889537819636601929L;

	public static final String COLUMN_PID_STR = "pid";

	public static final short TYPE_SALES_SHORT = 0;// 销售单

	public static final short TYPE_MATERIAL_SHORT = 1;// 主材单

	private long psid;

	private long pid;

	private long sid;

	private short type;

	@Id
	@GeneratedValue
	@Column(name = "psid")
	public long getPsid() {
		return psid;
	}

	public void setPsid(long psid) {
		this.psid = psid;
	}

	@Column(name = "pid")
	public long getPid() {
		return pid;
	}

	public void setPid(long pid) {
		this.pid = pid;
	}

	@Column(name = "sid")
	public long getSid() {
		return sid;
	}

	public void setSid(long sid) {
		this.sid = sid;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

}
