package com.fanglin.personel.vo;

import java.io.Serializable;

import com.fanglin.communion.po.BrandPO;

public class SupplierContractBrandVO implements Serializable {

	private static final long serialVersionUID = -3873476866237850519L;

	private Long scbid;

	private Long scid;// 合同ID

	private BrandPO brand;

	private Short ctype;// 结算类型 , 0: 底价 , 1: 点位

	private Integer cvalue;// 结算值

	private Integer breakpay;// 违约金

	public SupplierContractBrandVO() {
		super();
	}

	public SupplierContractBrandVO(BrandPO brand) {
		super();
		this.brand = brand;
	}

	public Long getScbid() {
		return scbid;
	}

	public void setScbid(Long scbid) {
		this.scbid = scbid;
	}

	public Long getScid() {
		return scid;
	}

	public void setScid(Long scid) {
		this.scid = scid;
	}

	public BrandPO getBrand() {
		return brand;
	}

	public void setBrand(BrandPO brand) {
		this.brand = brand;
	}

	public Short getCtype() {
		return ctype;
	}

	public void setCtype(Short ctype) {
		this.ctype = ctype;
	}

	public Integer getCvalue() {
		return cvalue;
	}

	public void setCvalue(Integer cvalue) {
		this.cvalue = cvalue;
	}

	public Integer getBreakpay() {
		return breakpay;
	}

	public void setBreakpay(Integer breakpay) {
		this.breakpay = breakpay;
	}

}
