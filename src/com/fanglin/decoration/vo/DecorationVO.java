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

	private Short resourceType;

	private UserBaseVO contractUserId;

	private Timestamp contractTime;

	private Timestamp measureTime;

	private Timestamp depositTime;

	private Timestamp createTime;

	private Timestamp accountTime;
	
	private Timestamp precontractTime;

	private Short status;

	private Short projectStatus;

	private Integer otherStatus;

	private QuotationVersionVO version;

	private Long orderTotalPrice;

	private Long quotationPrice;

	private Integer notSalesmanRate;

	private Integer discount;

	private Long couponCut;

	private Long thingCut;

	private Long netperfor;

	private Long comperfor;
	
	private Long precontractPrice;

	private String dompany;

	private Short paySacle;

	private String scale;
	
	private String grade;
	
	private Long factPrice;
	
	public DecorationVO(){
		super();
	}
	
	public DecorationVO(CustomerVO customer, HouseVO house) {
		super();
		this.customer = customer;
		this.house = house;
	}

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
	
	@JSON(format = "yyyy-MM-dd")
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

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getMeasureTime() {
		return measureTime;
	}

	public void setMeasureTime(Timestamp measureTime) {
		this.measureTime = measureTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getDepositTime() {
		return depositTime;
	}

	public void setDepositTime(Timestamp depositTime) {
		this.depositTime = depositTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}
	
	@JSON(format = "yyyy-MM-dd")
	public Timestamp getPrecontractTime() {
		return precontractTime;
	}

	public void setPrecontractTime(Timestamp precontractTime) {
		this.precontractTime = precontractTime;
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

	public Long getOrderTotalPrice() {
		return orderTotalPrice;
	}

	public void setOrderTotalPrice(Long orderTotalPrice) {
		this.orderTotalPrice = orderTotalPrice;
	}

	public Integer getNotSalesmanRate() {
		return notSalesmanRate;
	}

	public void setNotSalesmanRate(Integer notSalesmanRate) {
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

	public Short getResourceType() {
		return resourceType;
	}

	public void setResourceType(Short resourceType) {
		this.resourceType = resourceType;
	}

	public Integer getDiscount() {
		return discount;
	}

	public void setDiscount(Integer discount) {
		this.discount = discount;
	}

	public Long getQuotationPrice() {
		return quotationPrice;
	}

	public void setQuotationPrice(Long quotationPrice) {
		this.quotationPrice = quotationPrice;
	}

	public Short getPaySacle() {
		return paySacle;
	}

	public void setPaySacle(Short paySacle) {
		this.paySacle = paySacle;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getAccountTime() {
		return accountTime;
	}

	public void setAccountTime(Timestamp accountTime) {
		this.accountTime = accountTime;
	}

	public Long getCouponCut() {
		return couponCut;
	}

	public void setCouponCut(Long couponCut) {
		this.couponCut = couponCut;
	}

	public Long getThingCut() {
		return thingCut;
	}

	public void setThingCut(Long thingCut) {
		this.thingCut = thingCut;
	}

	public Long getNetperfor() {
		return netperfor;
	}

	public void setNetperfor(Long netperfor) {
		this.netperfor = netperfor;
	}

	public Long getComperfor() {
		return comperfor;
	}

	public void setComperfor(Long comperfor) {
		this.comperfor = comperfor;
	}
	
	public Long getPrecontractPrice() {
		return precontractPrice;
	}

	public void setPrecontractPrice(Long precontractPrice) {
		this.precontractPrice = precontractPrice;
	}

	public String getGrade() {
		return grade;
	}

	public void setGrade(String grade) {
		this.grade = grade;
	}

	public void vtp(DecorationPO decorationPO) {
		BeanUtil.copyProperties(this, decorationPO, Arrays.asList("house", "customer", "designer", "salesman", "supervisor", "version", "createUser", "quoter", "escorter", "contractUserId"));
	}

	public String getScale() {
		return scale;
	}

	public void setScale(String scale) {
		this.scale = scale;
	}

	public Long getFactPrice() {
		return factPrice;
	}

	public void setFactPrice(Long factPrice) {
		this.factPrice = factPrice;
	}

}
