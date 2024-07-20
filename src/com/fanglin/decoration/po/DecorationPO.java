/**
 * @File Name		: QuotationTemplatePO.java
 * @Package 	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-7-26
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.po;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.po.HousePO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.data.po.QuotationVersionPO;
import com.fanglin.data.quotation.vo.QuotationVersionVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.system.vo.CityVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "decoration", catalog = "decoration")
public class DecorationPO implements Serializable {

	private static final long serialVersionUID = -5971474052433500262L;

	public static final short STATUS_INIT_INT = 0;// 初始

	public static final short STATUS_DEPOSIT_INT = 1;// 定金

	public static final short STATUS_PROSIGN_INT = 2;// 预签

	public static final short STATUS_SIGNED_INT = 3;// 签约

	public static final short STATUS_RESIGNED_INT = 4;// 重签

	public static final short STATUS_WASTE_INT = 5;// 废单

	public static final short STATUS_TERMINATION_INT = 6;// 终止

	public static final short STATUS_FINAL_INT = 7;// 决算

	public static final short STATUS_COMPLETED_INT = 8;// 完工

	public static final long PROJECTSTATUS_INITIAL_INT = 0; // 初始

	public static final long PROJECTSTATUS_START_INT = 1; // 开工

	public static final long PROJECTSTATUS_FINISH_INT = 2; // 完工

	public static final short DESIGNSTATUS_INITIA_INT = 0;// 待设计

	public static final short DESIGNSTATUS_CONDUCT_INT = 1;// 设计中

	public static final short DESIGNSTATUS_END_INT = 2;// 已完成

	public static final short STATUS_INITIA_INT = 0;// 待确认

	public static final short STATUS_CONTRACT_CONFIRMATION_INT = 1;// 合同确认

	public static final short STATUS_SETTING_OUT_CONFIRMATION_INT = 2;// 放线确认

	public static final short TYPE_INIT_SALESCALE_INT = 1918;// 销售比例默认值1918

	public static final short TYPE_MIDPACK_INT = 0;

	public static final short TYPE_INCLUSIVE_INT = 1;

	public static final short TYPE_HOLONOMY_INT = 2;

	public static final short BALANCESTATUS_CONDUCT_INT = 1;// 结算

	public static final String CONFIG_KEY_HOLONOMY_STR = "fullsub%s";

	private long doid;

	private String orderId;

	private CustomerPO customer;

	private HousePO house;

	private UserPO designer;

	private UserPO salesman;

	private UserPO supervisor;

	private UserPO creater;

	private UserPO quoter;

	private UserPO escorter;

	private UserPO contracter;

	private short type;

	private short typeness;

	private String grade;

	private String salesmanType = "守园";

	private long busitype;

	private String houseType;

	private String houseClass;

	private short resourceType;

	private DecorationAdditionPO addition;

	private long orderTotalPrice;

	private long quotationPrice;

	private long couponCut;

	private long thingCut;

	private long factPrice;

	private long precontractPrice;

	private Timestamp contractTime;

	private Timestamp measureTime;

	private Timestamp depositTime;

	private Timestamp createTime;

	private Timestamp balanceTime;

	private Timestamp accountTime;

	private Timestamp sdesignTime;

	private Timestamp edesignTime;

	private Timestamp precontractTime;

	private Timestamp terminalTime;

	private short status;

	private short designStatus;

	private long projectStatus;

	private short sourceStatus;

	private short repairStatus;

	private short balanceStatus;

	private int otherStatus;

	private QuotationVersionPO version;

	private int notSalesmanRate = 0;

	private int quotationTimeLimit;

	private short paySacle;

	private short saleScale;

	private int discount;

	private int company;

	private int conpany;

	public DecorationPO() {
	}

	public DecorationPO(String orderId) {
		super();
		this.orderId = orderId;
	}

	@Id
	@GeneratedValue
	@Column(name = "doid")
	public long getDoid() {
		return doid;
	}

	public void setDoid(long doid) {
		this.doid = doid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "customerId", referencedColumnName = "cid")
	public CustomerPO getCustomer() {
		return customer;
	}

	public void setCustomer(CustomerPO customer) {
		this.customer = customer;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "hid", referencedColumnName = "hId")
	public HousePO getHouse() {
		return house;
	}

	public void setHouse(HousePO house) {
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

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "dsuid", referencedColumnName = "uId")
	public UserPO getDesigner() {
		return designer;
	}

	public void setDesigner(UserPO designer) {
		this.designer = designer;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "smuid", referencedColumnName = "uId")
	public UserPO getSalesman() {
		return salesman;
	}

	public void setSalesman(UserPO salesman) {
		this.salesman = salesman;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "svuid", referencedColumnName = "uId")
	public UserPO getSupervisor() {
		return supervisor;
	}

	public void setSupervisor(UserPO supervisor) {
		this.supervisor = supervisor;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "ctuid", referencedColumnName = "uId")
	public UserPO getContracter() {
		return contracter;
	}

	public void setContracter(UserPO contracter) {
		this.contracter = contracter;
	}

	public Timestamp getMeasureTime() {
		return measureTime;
	}

	public void setMeasureTime(Timestamp measureTime) {
		this.measureTime = measureTime;
	}

	public Timestamp getDepositTime() {
		return depositTime;
	}

	public void setDepositTime(Timestamp depositTime) {
		this.depositTime = depositTime;
	}

	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Timestamp getBalanceTime() {
		return balanceTime;
	}

	public void setBalanceTime(Timestamp balanceTime) {
		this.balanceTime = balanceTime;
	}

	public Timestamp getSdesignTime() {
		return sdesignTime;
	}

	public void setSdesignTime(Timestamp sdesignTime) {
		this.sdesignTime = sdesignTime;
	}

	public Timestamp getEdesignTime() {
		return edesignTime;
	}

	public void setEdesignTime(Timestamp edesignTime) {
		this.edesignTime = edesignTime;
	}

	public Timestamp getPrecontractTime() {
		return precontractTime;
	}

	public void setPrecontractTime(Timestamp precontractTime) {
		this.precontractTime = precontractTime;
	}

	public Timestamp getTerminalTime() {
		return terminalTime;
	}

	public void setTerminalTime(Timestamp terminalTime) {
		this.terminalTime = terminalTime;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	public short getTypeness() {
		return typeness;
	}

	public void setTypeness(short typeness) {
		this.typeness = typeness;
	}

	public short getDesignStatus() {
		return designStatus;
	}

	public void setDesignStatus(short designStatus) {
		this.designStatus = designStatus;
	}

	public long getProjectStatus() {
		return projectStatus;
	}

	public void setProjectStatus(long projectStatus) {
		this.projectStatus = projectStatus;
	}

	public short getSourceStatus() {
		return sourceStatus;
	}

	public void setSourceStatus(short sourceStatus) {
		this.sourceStatus = sourceStatus;
	}

	public short getRepairStatus() {
		return repairStatus;
	}

	public void setRepairStatus(short repairStatus) {
		this.repairStatus = repairStatus;
	}

	public short getBalanceStatus() {
		return balanceStatus;
	}

	public void setBalanceStatus(short balanceStatus) {
		this.balanceStatus = balanceStatus;
	}

	public Timestamp getContractTime() {
		return contractTime;
	}

	public void setContractTime(Timestamp contractTime) {
		this.contractTime = contractTime;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "cuid", referencedColumnName = "uId")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "versionId", referencedColumnName = "no")
	public QuotationVersionPO getVersion() {
		return version;
	}

	public void setVersion(QuotationVersionPO version) {
		this.version = version;
	}

	public long getOrderTotalPrice() {
		return orderTotalPrice;
	}

	public void setOrderTotalPrice(long orderTotalPrice) {
		this.orderTotalPrice = orderTotalPrice;
	}

	public int getNotSalesmanRate() {
		return notSalesmanRate;
	}

	public void setNotSalesmanRate(int notSalesmanRate) {
		this.notSalesmanRate = notSalesmanRate;
	}

	public String getSalesmanType() {
		return salesmanType;
	}

	public void setSalesmanType(String salesmanType) {
		this.salesmanType = salesmanType;
	}

	@Column(name = "busitype")
	public long getBusitype() {
		return busitype;
	}

	public void setBusitype(long busitype) {
		this.busitype = busitype;
	}

	public int getOtherStatus() {
		return otherStatus;
	}

	public void setOtherStatus(int otherStatus) {
		this.otherStatus = otherStatus;
	}

	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	public int getConpany() {
		return conpany;
	}

	public void setConpany(int conpany) {
		this.conpany = conpany;
	}

	public int getQuotationTimeLimit() {
		return quotationTimeLimit;
	}

	public void setQuotationTimeLimit(int quotationTimeLimit) {
		this.quotationTimeLimit = quotationTimeLimit;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "quId", referencedColumnName = "uId")
	public UserPO getQuoter() {
		return quoter;
	}

	public void setQuoter(UserPO quoter) {
		this.quoter = quoter;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "euId", referencedColumnName = "uId")
	public UserPO getEscorter() {
		return escorter;
	}

	public void setEscorter(UserPO escorter) {
		this.escorter = escorter;
	}

	public short getResourceType() {
		return resourceType;
	}

	public void setResourceType(short resourceType) {
		this.resourceType = resourceType;
	}

	public long getQuotationPrice() {
		return quotationPrice;
	}

	public void setQuotationPrice(long quotationPrice) {
		this.quotationPrice = quotationPrice;
	}

	public short getPaySacle() {
		return paySacle;
	}

	public void setPaySacle(short paySacle) {
		this.paySacle = paySacle;
	}

	public short getSaleScale() {
		return saleScale;
	}

	public void setSaleScale(short saleScale) {
		this.saleScale = saleScale;
	}

	public int getDiscount() {
		return discount;
	}

	public void setDiscount(int discount) {
		this.discount = discount;
	}

	public long getCouponCut() {
		return couponCut;
	}

	public void setCouponCut(long couponCut) {
		this.couponCut = couponCut;
	}

	public long getThingCut() {
		return thingCut;
	}

	public void setThingCut(long thingCut) {
		this.thingCut = thingCut;
	}

	public long getPrecontractPrice() {
		return precontractPrice;
	}

	public void setPrecontractPrice(long precontractPrice) {
		this.precontractPrice = precontractPrice;
	}

	public Timestamp getAccountTime() {
		return accountTime;
	}

	public void setAccountTime(Timestamp accountTime) {
		this.accountTime = accountTime;
	}

	@ManyToOne
	@JoinColumn(nullable = true, name = "orderId", referencedColumnName = "orderId", insertable = false, updatable = false)
	public DecorationAdditionPO getAddition() {
		return addition;
	}

	public void setAddition(DecorationAdditionPO addition) {
		this.addition = addition;
	}

	@Column(name = "grade")
	public String getGrade() {
		return grade;
	}

	public void setGrade(String grade) {
		this.grade = grade;
	}

	@Column(name = "factPrice")
	public long getFactPrice() {
		return factPrice;
	}

	public void setFactPrice(long factPrice) {
		this.factPrice = factPrice;
	}

	private void ptv(DecorationVO decorationVO) {
		BeanUtil.copyProperties(this, decorationVO, Arrays.asList("house", "customer", "designer", "salesman", "supervisor", "version", "creater", "quoter", "escorter", "contractUserId", "conpany"));

		if (decorationVO.getOrderTotalPrice() == null) {
			decorationVO.setOrderTotalPrice(new Long(0));
		}

		decorationVO.setHouse(new HouseVO(new VillageVO(new CityProperVO(new CityVO()))));
		BeanUtil.copyProperties(this.getHouse(), decorationVO.getHouse(), Arrays.asList("village"));
		BeanUtil.copyProperties(this.getHouse().getVillage(), decorationVO.getHouse().getVillage(), Arrays.asList("cityProper"));
		BeanUtil.copyProperties(this.getHouse().getVillage().getCityProper(), decorationVO.getHouse().getVillage().getCityProper(), Arrays.asList("city"));
		BeanUtil.copyProperties(this.getHouse().getVillage().getCityProper().getCity(), decorationVO.getHouse().getVillage().getCityProper().getCity(), Arrays.asList("region"));

		CustomerVO customerVO = new CustomerVO();
		BeanUtil.copyProperties(this.getCustomer(), customerVO);

		decorationVO.setCustomer(customerVO);

		decorationVO.setDesigner(new UserBaseVO());
		decorationVO.setSalesman(new UserBaseVO());

		decorationVO.getDesigner().setDuty(new DutyVO());
		decorationVO.getDesigner().setDept(new DepartmentVO());
		decorationVO.getDesigner().getDept().setFatherDept(new DepartmentVO());

		BeanUtil.copyPropertie(this.getDesigner(), decorationVO.getDesigner(), Arrays.asList("duty", "dept"));
		BeanUtil.copyPropertie(this.getDesigner().getDuty(), decorationVO.getDesigner().getDuty(), Arrays.asList("departmentType"));
		BeanUtil.copyPropertie(this.getDesigner().getDept(), decorationVO.getDesigner().getDept(), Arrays.asList("type", "fatherDept", "manager"));
		BeanUtil.copyPropertie(this.getDesigner().getDept().getFatherDept(), decorationVO.getDesigner().getDept().getFatherDept(), Arrays.asList("type", "fatherDept", "manager"));

		decorationVO.getSalesman().setDuty(new DutyVO());
		decorationVO.getSalesman().setDept(new DepartmentVO());
		decorationVO.getSalesman().getDept().setFatherDept(new DepartmentVO());

		BeanUtil.copyPropertie(this.getSalesman(), decorationVO.getSalesman(), Arrays.asList("duty", "dept"));
		BeanUtil.copyPropertie(this.getSalesman().getDuty(), decorationVO.getSalesman().getDuty(), Arrays.asList("departmentType"));
		BeanUtil.copyPropertie(this.getSalesman().getDept(), decorationVO.getSalesman().getDept(), Arrays.asList("type", "fatherDept", "manager"));
		BeanUtil.copyPropertie(this.getSalesman().getDept().getFatherDept(), decorationVO.getSalesman().getDept().getFatherDept(), Arrays.asList("type", "fatherDept", "manager"));

		decorationVO.setVersion(new QuotationVersionVO());

		BeanUtil.copyPropertie(this.getVersion(), decorationVO.getVersion());
	}

	public void ptvcascade(DecorationVO decorationVO) {

		ptv(decorationVO);

		if (decorationVO.getSupervisor() != null && this.getSupervisor() != null) {

			decorationVO.getSupervisor().setDuty(new DutyVO());
			decorationVO.getSupervisor().setDept(new DepartmentVO());
			decorationVO.getSupervisor().getDept().setFatherDept(new DepartmentVO());

			BeanUtil.copyPropertie(this.getSupervisor(), decorationVO.getSupervisor(), Arrays.asList("duty", "dept"));
			BeanUtil.copyPropertie(this.getSupervisor().getDuty(), decorationVO.getSupervisor().getDuty(), Arrays.asList("departmentType"));
			BeanUtil.copyPropertie(this.getSupervisor().getDept(), decorationVO.getSupervisor().getDept(), Arrays.asList("type", "fatherDept", "manager"));
			BeanUtil.copyPropertie(this.getSupervisor().getDept().getFatherDept(), decorationVO.getSupervisor().getDept().getFatherDept(), Arrays.asList("type", "fatherDept", "manager"));
		}

		if (decorationVO.getCreater() != null && this.getCreater() != null) {

			decorationVO.getCreater().setDuty(new DutyVO());
			decorationVO.getCreater().setDept(new DepartmentVO());
			decorationVO.getCreater().getDept().setFatherDept(new DepartmentVO());

			BeanUtil.copyPropertie(this.getCreater(), decorationVO.getCreater(), Arrays.asList("duty", "dept"));
			BeanUtil.copyPropertie(this.getCreater().getDuty(), decorationVO.getCreater().getDuty(), Arrays.asList("departmentType"));
			BeanUtil.copyPropertie(this.getCreater().getDept(), decorationVO.getCreater().getDept(), Arrays.asList("type", "fatherDept", "manager"));
			BeanUtil.copyPropertie(this.getCreater().getDept().getFatherDept(), decorationVO.getCreater().getDept().getFatherDept(), Arrays.asList("type", "fatherDept", "manager"));
		}

		if (decorationVO.getQuoter() != null && this.getQuoter() != null) {
			BeanUtil.copyPropertie(this.getQuoter(), decorationVO.getQuoter(), Arrays.asList("duty", "dept"));
		}

		if (decorationVO.getEscorter() != null && this.getEscorter() != null) {
			BeanUtil.copyPropertie(this.getEscorter(), decorationVO.getEscorter(), Arrays.asList("duty", "dept"));
		}
	}

}
