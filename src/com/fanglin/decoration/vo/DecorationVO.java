/**
 * @File Name		: QuotationItemVO.java
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date			: 2014-7-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.vo;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Arrays;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.data.quotation.vo.QuotationVersionVO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;

public class DecorationVO implements Serializable {

	private static final long serialVersionUID = 1112545655558888L;
	
	private Long doid;
	
	private String orderId;
	
	private CustomerVO customer;
	
	private HouseVO house;
	
	

	private UserBaseVO designer;
	
	private UserBaseVO salesman;
	
	private UserBaseVO supervisor;
	
	private UserBaseVO creater;
	
	private UserBaseVO quoter;
	
	private UserBaseVO escorter;
	
	
	
	private Short type;
	
	private String salesmanType;
	
	private String houseType;
	
	private String houseClass;
	
	private Integer resourceType;
	
	private Float freeArea;
	
	
	
	private String contractCode;
	
	private UserBaseVO contractUserId;
	
	
	
	private Timestamp contractTime;
	
	private Timestamp measureTime;
	
	private Timestamp depositTime;
	
	private Timestamp createTime;
	
	private Timestamp accountTime;
	
	
	
	private Short status;
		
	private Short projectStatus;
	
	private Integer otherStatus;
	
	
	
	private QuotationVersionVO version;
	
	private Float orderTotalPrice;
	
	private Float quotationPrice;

	private Float notSalesmanRate;
	
	private Float discount;
	
	private Float couponCut;
	
	private Float thingCut;
	
	private Float netperfor;
	
	private Float comperfor;

	
	private String dompany;
	
	private Short paySacle;
	
	private String scale;


	public Long getDoid() {
		return doid;
	}

	public void setDoid(Long doid) {
		this.doid = doid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public CustomerVO getCustomer() {
		return customer;
	}

	public void setCustomer(CustomerVO customer) {
		this.customer = customer;
	}

	public HouseVO getHouse() {
		return house;
	}

	public void setHouse(HouseVO house) {
		this.house = house;
	}

	public String getHouseType() {
		return houseType;
	}

	public void setHouseType(String houseType) {
		this.houseType = houseType;
	}

	public String getHouseClass() {
		return houseClass;
	}

	public void setHouseClass(String houseClass) {
		this.houseClass = houseClass;
	}

	public Float getFreeArea() {
		return freeArea;
	}

	public void setFreeArea(Float freeArea) {
		this.freeArea = freeArea;
	}

	public UserBaseVO getDesigner() {
		return designer;
	}

	public void setDesigner(UserBaseVO designer) {
		this.designer = designer;
	}

	public UserBaseVO getSalesman() {
		return salesman;
	}

	public void setSalesman(UserBaseVO salesman) {
		this.salesman = salesman;
	}

	public UserBaseVO getSupervisor() {
		return supervisor;
	}

	public void setSupervisor(UserBaseVO supervisor) {
		this.supervisor = supervisor;
	}

	public String getContractCode() {
		return contractCode;
	}

	public void setContractCode(String contractCode) {
		this.contractCode = contractCode;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getContractTime() {
		return contractTime;
	}

	public void setContractTime(Timestamp contractTime) {
		this.contractTime = contractTime;
	}

	public UserBaseVO getContractUserId() {
		return contractUserId;
	}

	public void setContractUserId(UserBaseVO contractUserId) {
		this.contractUserId = contractUserId;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getMeasureTime() {
		return measureTime;
	}

	public void setMeasureTime(Timestamp measureTime) {
		this.measureTime = measureTime;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getDepositTime() {
		return depositTime;
	}

	public void setDepositTime(Timestamp depositTime) {
		this.depositTime = depositTime;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getProjectStatus() {
		return projectStatus;
	}

	public void setProjectStatus(Short projectStatus) {
		this.projectStatus = projectStatus;
	}

	public Integer getOtherStatus() {
		return otherStatus;
	}

	public void setOtherStatus(Integer otherStatus) {
		this.otherStatus = otherStatus;
	}

	public QuotationVersionVO getVersion() {
		return version;
	}

	public void setVersion(QuotationVersionVO version) {
		this.version = version;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	public Float getOrderTotalPrice() {
		return orderTotalPrice;
	}

	public void setOrderTotalPrice(Float orderTotalPrice) {
		this.orderTotalPrice = orderTotalPrice;
	}

	public Float getNotSalesmanRate() {
		return notSalesmanRate;
	}

	public void setNotSalesmanRate(Float notSalesmanRate) {
		this.notSalesmanRate = notSalesmanRate;
	}

	public String getSalesmanType() {
		return salesmanType;
	}

	public void setSalesmanType(String salesmanType) {
		this.salesmanType = salesmanType;
	}

	public String getDompany() {
		return dompany;
	}

	public void setDompany(String dompany) {
		this.dompany = dompany;
	}

	public UserBaseVO getQuoter() {
		return quoter;
	}

	public void setQuoter(UserBaseVO quoter) {
		this.quoter = quoter;
	}

	public UserBaseVO getEscorter() {
		return escorter;
	}

	public void setEscorter(UserBaseVO escorter) {
		this.escorter = escorter;
	}

	public Integer getResourceType() {
		return resourceType;
	}

	public void setResourceType(Integer resourceType) {
		this.resourceType = resourceType;
	}

	public Float getDiscount() {
		return discount;
	}

	public void setDiscount(Float discount) {
		this.discount = discount;
	}
	
	public Float getQuotationPrice() {
		return quotationPrice;
	}

	public void setQuotationPrice(Float quotationPrice) {
		this.quotationPrice = quotationPrice;
	}

	public Short getPaySacle() {
		return paySacle;
	}

	public void setPaySacle(Short paySacle) {
		this.paySacle = paySacle;
	}
	
	@JSON(format="yyyy-MM-dd")
	public Timestamp getAccountTime() {
		return accountTime;
	}

	public void setAccountTime(Timestamp accountTime) {
		this.accountTime = accountTime;
	}

	public Float getCouponCut() {
		return couponCut;
	}

	public void setCouponCut(Float couponCut) {
		this.couponCut = couponCut;
	}

	public Float getThingCut() {
		return thingCut;
	}

	public void setThingCut(Float thingCut) {
		this.thingCut = thingCut;
	}

	public Float getNetperfor() {
		return netperfor;
	}

	public void setNetperfor(Float netperfor) {
		this.netperfor = netperfor;
	}

	public Float getComperfor() {
		return comperfor;
	}

	public void setComperfor(Float comperfor) {
		this.comperfor = comperfor;
	}

	public void vtp(DecorationPO decorationPO){
		BeanUtil.copyProperties(this, decorationPO, Arrays.asList("house","customer","designer","salesman","supervisor","version","createUser","quoter","escorter","contractUserId"));
	}
	
	public String getScale() {
		return scale;
	}

	public void setScale(String scale) {
		this.scale = scale;
	}

}
