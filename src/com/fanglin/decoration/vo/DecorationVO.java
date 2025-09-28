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

	private UserBaseVO creater;

	private UserBaseVO designer;

	private UserBaseVO salesman;

	private UserBaseVO supervisor;

	private UserBaseVO quoter;

	private UserBaseVO escorter;

	private UserBaseVO contracter;

	private UserBaseVO materialer;

	private QuotationVersionVO version;

	private Short type;

	private Short typeness;

	private String salesmanType;

	private Long busitype;

	private String houseType;

	private String houseClass;

	private Short resourceType;

	private Short referType;

	private Timestamp createTime;

	private Timestamp issueTime;

	private Timestamp meetTime;

	private Timestamp measureTime;

	private Timestamp belongTime;

	private Timestamp depositTime;

	private Timestamp sdesignTime;

	private Timestamp edesignTime;

	private Timestamp contractTime;

	private Timestamp precontractTime;

	private Timestamp recontractTime;

	private Timestamp balanceTime;

	private Timestamp accountTime;

	private Timestamp terminalTime;

	private Short status;

	private Short designStatus;

	private Long projectStatus;

	private Short sourceStatus;

	private Short repairStatus;

	private Short balanceStatus;

	private Integer otherStatus;

	private Long orderTotalPrice;

	private Long quotationPrice;

	private Integer notSalesmanRate;

	private Integer discount;

	private Long couponCut;

	private Long thingCut;

	private Long precontractPrice;

	private Short paySacle;

	private Short saleScale;

	private String scale;

	private String grade;

	private Long factPrice;

	private Integer company;

	private String dompany;

	private String conpany;

	private String bompany;

	public DecorationVO() {
		super();
	}

	public DecorationVO(String orderId) {
		super();
		this.orderId = orderId;
	}

	public DecorationVO(CustomerVO customer, HouseVO house) {
		super();
		this.customer = customer;
		this.house = house;
	}

	public DecorationVO(UserBaseVO supervisor) {
		super();
		this.supervisor = supervisor;
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

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
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

	public UserBaseVO getSupervisor() {
		return supervisor;
	}

	public void setSupervisor(UserBaseVO supervisor) {
		this.supervisor = supervisor;
	}

	public UserBaseVO getContracter() {
		return contracter;
	}

	public void setContracter(UserBaseVO contracter) {
		this.contracter = contracter;
	}

	public UserBaseVO getMaterialer() {
		return materialer;
	}

	public void setMaterialer(UserBaseVO materialer) {
		this.materialer = materialer;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getIssueTime() {
		return issueTime;
	}

	public void setIssueTime(Timestamp issueTime) {
		this.issueTime = issueTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getMeetTime() {
		return meetTime;
	}

	public void setMeetTime(Timestamp meetTime) {
		this.meetTime = meetTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getMeasureTime() {
		return measureTime;
	}

	public void setMeasureTime(Timestamp measureTime) {
		this.measureTime = measureTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getBelongTime() {
		return belongTime;
	}

	public void setBelongTime(Timestamp belongTime) {
		this.belongTime = belongTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getContractTime() {
		return contractTime;
	}

	public void setContractTime(Timestamp contractTime) {
		this.contractTime = contractTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getDepositTime() {
		return depositTime;
	}

	public void setDepositTime(Timestamp depositTime) {
		this.depositTime = depositTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getBalanceTime() {
		return balanceTime;
	}

	public void setBalanceTime(Timestamp balanceTime) {
		this.balanceTime = balanceTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getSdesignTime() {
		return sdesignTime;
	}

	public void setSdesignTime(Timestamp sdesignTime) {
		this.sdesignTime = sdesignTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getEdesignTime() {
		return edesignTime;
	}

	public void setEdesignTime(Timestamp edesignTime) {
		this.edesignTime = edesignTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getPrecontractTime() {
		return precontractTime;
	}

	public void setPrecontractTime(Timestamp precontractTime) {
		this.precontractTime = precontractTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getRecontractTime() {
		return recontractTime;
	}

	public void setRecontractTime(Timestamp recontractTime) {
		this.recontractTime = recontractTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getTerminalTime() {
		return terminalTime;
	}

	public void setTerminalTime(Timestamp terminalTime) {
		this.terminalTime = terminalTime;
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

	public Short getTypeness() {
		return typeness;
	}

	public void setTypeness(Short typeness) {
		this.typeness = typeness;
	}

	public Short getDesignStatus() {
		return designStatus;
	}

	public void setDesignStatus(Short designStatus) {
		this.designStatus = designStatus;
	}

	public Long getProjectStatus() {
		return projectStatus;
	}

	public void setProjectStatus(Long projectStatus) {
		this.projectStatus = projectStatus;
	}

	public Short getSourceStatus() {
		return sourceStatus;
	}

	public void setSourceStatus(Short sourceStatus) {
		this.sourceStatus = sourceStatus;
	}

	public Short getRepairStatus() {
		return repairStatus;
	}

	public void setRepairStatus(Short repairStatus) {
		this.repairStatus = repairStatus;
	}

	public Short getBalanceStatus() {
		return balanceStatus;
	}

	public void setBalanceStatus(Short balanceStatus) {
		this.balanceStatus = balanceStatus;
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

	public Long getBusitype() {
		return busitype;
	}

	public void setBusitype(Long busitype) {
		this.busitype = busitype;
	}

	public Short getResourceType() {
		return resourceType;
	}

	public void setResourceType(Short resourceType) {
		this.resourceType = resourceType;
	}

	public Short getReferType() {
		return referType;
	}

	public void setReferType(Short referType) {
		this.referType = referType;
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

	public Short getSaleScale() {
		return saleScale;
	}

	public void setSaleScale(Short saleScale) {
		this.saleScale = saleScale;
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

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public String getDompany() {
		return dompany;
	}

	public void setDompany(String dompany) {
		this.dompany = dompany;
	}

	public String getConpany() {
		return conpany;
	}

	public void setConpany(String conpany) {
		this.conpany = conpany;
	}

	public String getBompany() {
		return bompany;
	}

	public void setBompany(String bompany) {
		this.bompany = bompany;
	}

	public DecorationVO refer(short referType) {
		setReferType(referType);
		return this;
	}

	public void vtp(DecorationPO decorationPO) {
		BeanUtil.copyProperties(this, decorationPO, Arrays.asList("house", "customer", "designer", "salesman", "supervisor", "version", "createUser", "quoter", "escorter", "contractUserId", "conpany", "bompany"));
	}

}
