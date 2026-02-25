package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "decorationAtttype", catalog = "data")
public class DecorationAtttypePO implements Serializable {

	private static final long serialVersionUID = -8057882768985058037L;

	public static final short STATUS_ENABLE_INT = 0;

	private long daid;

	private String name;

	private short key;

	private short type;

	private short status;

	private short manageDiscount;

	private short taxDiscount;


	private int company;

	public DecorationAtttypePO() {
		super();
	}

	public DecorationAtttypePO(long daid) {
		super();
		this.daid = daid;
	}

	public DecorationAtttypePO(long daid, String name, short key, short type, short status, int company) {
		super();
		this.daid = daid;
		this.name = name;
		this.key = key;
		this.type = type;
		this.status = status;
		this.company = company;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "daid")
	public long getDaid() {
		return daid;
	}

	public void setDaid(long daid) {
		this.daid = daid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "key")
	public short getKey() {
		return key;
	}

	public void setKey(short key) {
		this.key = key;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
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

	@Column(name = "manageDiscount")
	public short getManageDiscount() {
		return manageDiscount;
	}

	public void setManageDiscount(short manageDiscount) {
		this.manageDiscount = manageDiscount;
	}

	@Column(name = "taxDiscount")
	public short getTaxDiscount() {
		return taxDiscount;
	}

	public void setTaxDiscount(short taxDiscount) {
		this.taxDiscount = taxDiscount;
	}

}
