package com.fanglin.personel.po;

import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "supplierBrandProduct", catalog = "communion")
public class SupplierBrandProductPO implements java.io.Serializable {

	private static final long serialVersionUID = -9073486016937854510L;

	private long sbpid;

	private long scbid; 

	private String name;

	private short ctype; // 结算类型 , 0: 底价 , 1: 点位

	private int cvalue; // 结算值

	private int breakpay; // 违约金
	
	private int warranTime; // 质保期
	
	public SupplierBrandProductPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "sbpid")
	public long getSbpid() {
		return sbpid;
	}

	public void setSbpid(long sbpid) {
		this.sbpid = sbpid;
	}

	@Column(name = "scbid")
	public long getScbid() {
		return scbid;
	}

	public void setScbid(long scbid) {
		this.scbid = scbid;
	}

	@Column(name = "ctype")
	public short getCtype() {
		return ctype;
	}

	public void setCtype(short ctype) {
		this.ctype = ctype;
	}

	@Column(name = "cvalue")
	public int getCvalue() {
		return cvalue;
	}

	public void setCvalue(int cvalue) {
		this.cvalue = cvalue;
	}

	@Column(name = "breakpay")
	public int getBreakpay() {
		return breakpay;
	}

	public void setBreakpay(int breakpay) {
		this.breakpay = breakpay;
	}
	
	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "warranTime")
	public int getWarranTime() {
		return warranTime;
	}

	public void setWarranTime(int warranTime) {
		this.warranTime = warranTime;
	}

}
