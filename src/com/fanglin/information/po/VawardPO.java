package com.fanglin.information.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "vaward", catalog = "information")
public class VawardPO implements java.io.Serializable {

	private static final long serialVersionUID = 4682511626604180928L;

	public static final short STATUS_INIT_INT = 0;

	private long vaid;

	private long vpid;

	private String no;

	private String name;

	private int price;

	private int num;
	
	private String unit;

	private short status;

	public VawardPO() {
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

	@Column(name = "vpid")
	public long getVpid() {
		return vpid;
	}

	public void setVpid(long vpid) {
		this.vpid = vpid;
	}

	@Column(name = "no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "price")
	public int getPrice() {
		return price;
	}

	public void setPrice(int price) {
		this.price = price;
	}

	@Column(name = "num")
	public int getNum() {
		return num;
	}

	public void setNum(int num) {
		this.num = num;
	}
	
	@Column(name = "unit")
	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

}