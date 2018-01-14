package com.fanglin.data.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="customerPhone", catalog = "communion")
public class CustomerPhonePO implements Serializable {

	private static final long serialVersionUID = 3461880420286597234L;
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final short STATUS_ENABLE_INT = 0;
	
	public static final short STATUS_DISABLE_INT = 1;

	private long cpid;
	
	private long cid;
	
	private String phone;
	
	private short status;
	
	public CustomerPhonePO() {
		super();
	}

	public CustomerPhonePO(int cpid) {
		super();
		this.cpid = cpid;
	}

	@Id
	@GeneratedValue
	@Column(name="cpid")
	public long getCpid() {
		return cpid;
	}

	public void setCpid(long cpid) {
		this.cpid = cpid;
	}
	
	@Column(name="cid")
	public long getCid() {
		return cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
	}

	@Column(name="phone")
	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	@Column(name="status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
	
}
