package com.fanglin.customer.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "customerUserRuleItem", catalog = "customer")
public class CustomerUserRuleItemPO implements Serializable {

	private static final long serialVersionUID = 1886589670333755624L;

	private long curiid;

	private long curid;

	private String name;

	private short type;

	private int uppval;

	private int lowval;

	private short priority;

	private short isSurplus;

	private short isDelete;

	private short status;

	public CustomerUserRuleItemPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "curiid")
	public long getCuriid() {
		return curiid;
	}

	public void setCuriid(long curiid) {
		this.curiid = curiid;
	}

	@Column(name = "curid")
	public long getCurid() {
		return curid;
	}

	public void setCurid(long curid) {
		this.curid = curid;
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

	@Column(name = "uppval")
	public int getUppval() {
		return uppval;
	}

	public void setUppval(int uppval) {
		this.uppval = uppval;
	}

	@Column(name = "lowval")
	public int getLowval() {
		return lowval;
	}

	public void setLowval(int lowval) {
		this.lowval = lowval;
	}

	@Column(name = "priority")
	public short getPriority() {
		return priority;
	}

	public void setPriority(short priority) {
		this.priority = priority;
	}

	@Column(name = "isSurplus")
	public short getIsSurplus() {
		return isSurplus;
	}

	public void setIsSurplus(short isSurplus) {
		this.isSurplus = isSurplus;
	}

	@Column(name = "isDelete")
	public short getIsDelete() {
		return isDelete;
	}

	public void setIsDelete(short isDelete) {
		this.isDelete = isDelete;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
}
