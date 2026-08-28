package com.fanglin.data.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.data.material.vo.NoodsVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "noods", catalog = "data")
public class NoodsPO implements Serializable {

	private static final long serialVersionUID = -65987712606770386L;

	public static final String COLUMN_NAME_STR = "name";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_COMPANY_STR = "company";

	public static final short STATUS_ENABLE_INT = 0;

	public static final short CALC_CACL_INT = 0;

	private long nid;

	private long pnid; // 上级定材:0=集团行/自建行,>0=引用行(指向集团行nid,名称等字段为集团快照)

	private String name;

	private int selling;

	private int balance;

	private int surplus;

	private short status;

	private short calc;

	private int company;

	public NoodsPO() {
		super();
	}

	public NoodsPO(long nid) {
		super();
		this.nid = nid;
	}

	@Id
	@GeneratedValue
	@Column(name = "nid")
	public long getNid() {
		return nid;
	}

	public void setNid(long nid) {
		this.nid = nid;
	}

	@Column(name = "pnid")
	public long getPnid() {
		return pnid;
	}

	public void setPnid(long pnid) {
		this.pnid = pnid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "selling")
	public int getSelling() {
		return selling;
	}

	public void setSelling(int selling) {
		this.selling = selling;
	}

	@Column(name = "balance")
	public int getBalance() {
		return balance;
	}

	public void setBalance(int balance) {
		this.balance = balance;
	}

	public int getSurplus() {
		return surplus;
	}

	public void setSurplus(int surplus) {
		this.surplus = surplus;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "calc")
	public short getCalc() {
		return calc;
	}

	public void setCalc(short calc) {
		this.calc = calc;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	public NoodsVO ptv(NoodsVO noodsVO) {

		BeanUtil.copyProperties(this, noodsVO, "");

		return noodsVO;
	}

}
