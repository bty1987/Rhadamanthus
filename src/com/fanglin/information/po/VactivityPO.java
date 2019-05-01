package com.fanglin.information.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "vactivity", catalog = "information")
public class VactivityPO implements java.io.Serializable {

	private static final long serialVersionUID = 121481506394097806L;
	
	public static final short STATUS_INIT_INT = 0;

	private long vaid;
	
	private String name;
	
	private short status;
	
	public VactivityPO() {
		super();
	}
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "vaid")
	public long getVaid() {
		return vaid;
	}

	public void setVaid(long vaid) {
		this.vaid = vaid;
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