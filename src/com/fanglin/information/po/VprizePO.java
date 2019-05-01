package com.fanglin.information.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "vprize", catalog = "information")
public class VprizePO implements java.io.Serializable {

	private static final long serialVersionUID = 3149648894029451412L;
	
	public static final short STATUS_INIT_INT = 0;

	private long vpid;
	
	private long vaid;
	
	private String name;
	
	private float price;
	
	private short status;
	
	public VprizePO() {
		super();
	}
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "vpid")
	public long getVpid() {
		return vpid;
	}

	public void setVpid(long vpid) {
		this.vpid = vpid;
	}

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

	@Column(name = "price")
	public float getPrice() {
		return price;
	}

	public void setPrice(float price) {
		this.price = price;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	
}