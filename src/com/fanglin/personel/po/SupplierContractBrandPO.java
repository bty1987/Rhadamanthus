package com.fanglin.personel.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.communion.po.BrandPO;
import com.fanglin.personel.vo.SupplierContractBrandVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "supplierContractBrand", catalog = "communion")
public class SupplierContractBrandPO implements java.io.Serializable {

	private static final long serialVersionUID = -9073486016937854510L;

	private long scbid;

	private long scid; // 合同ID

	private long sid;

	private String name;

	private BrandPO brand;

	private short ctype; // 结算类型 , 0: 底价 , 1: 点位

	private int cvalue; // 结算值

	private int breakpay; // 违约金
	
	private int warranTime; // 质保期
	
	private String servicePrice; // 服务费 , Json结构 , {"TL": "2016-01-01", "UV": 0, "DV": 0, "SR": 0}

	public SupplierContractBrandPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "scbid")
	public long getScbid() {
		return scbid;
	}

	public void setScbid(long scbid) {
		this.scbid = scbid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "bid", referencedColumnName = "bid")
	public BrandPO getBrand() {
		return brand;
	}

	public void setBrand(BrandPO brand) {
		this.brand = brand;
	}

	@Column(name = "scid")
	public long getScid() {
		return scid;
	}

	public void setScid(long scid) {
		this.scid = scid;
	}
	
	@Column(name = "sid")
	public long getSid() {
		return sid;
	}

	public void setSid(long sid) {
		this.sid = sid;
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
	
	
	@Column(name = "servicePrice")
	public String getServicePrice() {
		return servicePrice;
	}

	public void setServicePrice(String servicePrice) {
		this.servicePrice = servicePrice;
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

	public SupplierContractBrandVO ptv(SupplierContractBrandVO supplierBrandVO) {

		BeanUtil.copyProperties(this, supplierBrandVO, Arrays.asList("brand"));

		if (supplierBrandVO.getBrand() != null) BeanUtil.copyProperties(getBrand(), supplierBrandVO.getBrand(), Arrays.asList("category", "supplier"));

		return supplierBrandVO;
	}

}
