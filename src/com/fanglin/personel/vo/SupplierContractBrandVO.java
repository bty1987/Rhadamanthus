package com.fanglin.personel.vo;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import com.fanglin.communion.vo.BrandVO;

public class SupplierContractBrandVO implements Serializable {

	private static final long serialVersionUID = -3873476866237850519L;

	private Long scbid;

	private Long scid;// 合同ID

	private Long sid;

	private String name;

	private BrandVO brand;

	private Short ctype;// 结算类型 , 0: 底价 , 1: 点位

	private Integer cvalue;// 结算值

	private Integer breakpay;// 违约金
	
	private Integer warranTime; // 质保期
	
	private String servicePrice; // 服务费 , Json结构 , {"TL": "2016-01-01", "UV": 0, "DV": 0, "SR": 0}
	
	private List<SupplierContractCategoryVO> supplierContractCategorys;
	
	public SupplierContractBrandVO() {
		super();
	}

	public SupplierContractBrandVO(BrandVO brand,ArrayList<SupplierContractCategoryVO> supplierContractCategorys) {
		super();
		this.brand = brand;
		this.supplierContractCategorys = supplierContractCategorys;
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

	public Long getSid() {
		return sid;
	}

	public void setSid(Long sid) {
		this.sid = sid;
	}

	public BrandVO getBrand() {
		return brand;
	}

	public void setBrand(BrandVO brand) {
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

	public String getServicePrice() {
		return servicePrice;
	}

	public void setServicePrice(String servicePrice) {
		this.servicePrice = servicePrice;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getWarranTime() {
		return warranTime;
	}

	public void setWarranTime(Integer warranTime) {
		this.warranTime = warranTime;
	}
	
	public List<SupplierContractCategoryVO> getSupplierContractCategorys() {
		return supplierContractCategorys;
	}

	public void setSupplierContractCategorys(List<SupplierContractCategoryVO> supplierContractCategorys) {
		this.supplierContractCategorys = supplierContractCategorys;
	}

}
