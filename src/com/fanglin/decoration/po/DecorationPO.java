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
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.SystemConfig;

@Entity
@Table(name = "decoration", catalog = "decoration")
public class DecorationPO implements Serializable {

	private static final long serialVersionUID = -5971474052433500262L;
	
	public static final int RESOURCETYPE_CONSULT_STR = 0;
	
	public static final int RESOURCETYPE_AMOUNT_STR = 1;
	
	public static final Short QUOTATIONSTATUS_UNDONE_INT = 0;//未报价
	
	public static final Short QUOTATIONSTATUS_ALREADY_INT = 1;//已报价
	
	public static final Short STATUS_INIT_INT = 0;//初始
	
	public static final Short STATUS_DEPOSIT_INT = 1;//定金
	
	public static final Short STATUS_SIGNED_INT = 2;//已签约
	
	public static final Short STATUS_RESIGNED_INT = 3;//重签合同
	
	public static final Short STATUS_WASTE_INT = 4;//废单
	
	public static final Short STATUS_TERMINATION_INT = 5;//合同终止
	
	public static final Short STATUS_FINAL_INT = 6;//决算
	
	public static final Short STATUS_COMPLETED_INT = 7;//已完工
	
	public static final Short PROJECTSTATUS_INITIAL_INT = 0;	//工程初始
	
	public static final Short PROJECTSTATUS_START_INT = 1;		//开工
	
	public static final Short PROJECTSTATUS_FINISH_INT = 2;		//完工
	
	public static final String PROJECTSTATUS_FANG_APPLY_STR = "放线申请";
	
	public static final String PROJECTSTATUS_FANG_SUCCESS_STR = "放线成功";
	
	public static final String PROJECTSTATUS_FANG_FAIL_STR = "放线失败";
	
	public static final String HOUSETYPE_COMPLETE_STR = "现房";
	
	public static final String HOUSETYPE_OFFPLAN_STR = "期房";
	
	public static final String ACTIVITYSTATUS_RECEIVED_STR = "已领取";
	
	public static final String ACTIVITYSTATUS_UNRECEIVED_STR = "未领取";
	
	public static final int APPROVAL_MODIFICATION_INT = 0;
	
	public static final int APPROVAL_APPLY_INT = 1;
	
	public static final int APPROVAL_PASS_INT = 2;
	
	public static final int APPROVAL_UNPASS_INT = 3;
	
	public static final short TYPE_PART_INT = 0;
	
	public static final short TYPE_WHOLE_INT = 1;
	
	public static final short TYPE_HOLONOMY_INT = 2;
	
	private long doid;
	
	private String orderId;
	
	private CustomerPO customer;
	
	private HousePO house;
	
	

	private UserPO designer;
	
	private UserPO salesman;
	
	private UserPO supervisor;
	
	private UserPO createUser;
	
	private UserPO quoter;
	
	private UserPO escorter;
	
	
	
	private short type;
	
	private String salesmanType = "守园";
	
	private String houseType;
	
	private String houseClass;
	
	private String apartmentType;
	
	private int resourceType;
	
	private float freeArea;

	
	
	private String contractCode;
	
	private UserPO contractUserId;
	
	private float orderTotalPrice;
	
	private float quotationPrice;
	
	private short quotationStatus;
	
	
	
	private Timestamp contractTime;
	
	private Timestamp measureTime;
	
	private Timestamp depositTime;
	
	private Timestamp createTime;
	
	
	
	private short status;
	
	private short projectStatus;
	
	private int otherStatus;
	
	
	
	private QuotationVersionPO version;

	private float notSalesmanRate = 0f;
	
	private int quotationTimeLimit;
	
	
	private int company;
	
	private short paySacle;
	
	private float discount;
	
	
	public DecorationPO(){}
	
	public DecorationPO(String orderId) {
		super();
		this.orderId = orderId;
	}

	
	@GeneratedValue
	@Column(name="doid")
	public long getDoid(){
		return doid;
	}

	public void setDoid(long doid){
		this.doid = doid;
	}
	
	@Id
	@Column(name="orderId")
	public String getOrderId(){
		return orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "customerId",referencedColumnName="cid")
	public CustomerPO getCustomer(){
		return customer;
	}

	public void setCustomer(CustomerPO customer){
		this.customer = customer;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "hid", referencedColumnName="hId")
	public HousePO getHouse() {
		return house;
	}

	public void setHouse(HousePO house) {
		this.house = house;
	}

	public String getHouseType(){
		return houseType;
	}

	public void setHouseType(String houseType){
		this.houseType = houseType;
	}

	public String getHouseClass(){
		return houseClass;
	}

	public void setHouseClass(String houseClass){
		this.houseClass = houseClass;
	}

	public String getApartmentType(){
		return apartmentType;
	}

	public void setApartmentType(String apartmentType){
		this.apartmentType = apartmentType;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "dsuid", referencedColumnName="uId")
	public UserPO getDesigner(){
		return designer;
	}

	public void setDesigner(UserPO designer){
		this.designer = designer;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "smuid", referencedColumnName="uId")
	public UserPO getSalesman(){
		return salesman;
	}

	public void setSalesman(UserPO salesman){
		this.salesman = salesman;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "svuid", referencedColumnName="uId")
	public UserPO getSupervisor(){
		return supervisor;
	}

	public void setSupervisor(UserPO supervisor){
		this.supervisor = supervisor;
	}

	public String getContractCode(){
		return contractCode;
	}

	public void setContractCode(String contractCode){
		this.contractCode = contractCode;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "ctuid", referencedColumnName="uId")
	public UserPO getContractUserId() {
		return contractUserId;
	}

	public void setContractUserId(UserPO contractUserId) {
		this.contractUserId = contractUserId;
	}

	public Timestamp getMeasureTime(){
		return measureTime;
	}

	public void setMeasureTime(Timestamp measureTime){
		this.measureTime = measureTime;
	}

	public Timestamp getDepositTime() {
		return depositTime;
	}

	public void setDepositTime(Timestamp depositTime) {
		this.depositTime = depositTime;
	}

	public Timestamp getCreateTime(){
		return createTime;
	}

	public void setCreateTime(Timestamp createTime){
		this.createTime = createTime;
	}

	public short getQuotationStatus() {
		return quotationStatus;
	}

	public void setQuotationStatus(short quotationStatus) {
		this.quotationStatus = quotationStatus;
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
	
	public short getProjectStatus() {
		return projectStatus;
	}

	public void setProjectStatus(short projectStatus) {
		this.projectStatus = projectStatus;
	}

	public Timestamp getContractTime(){
		return contractTime;
	}
	
	public void setContractTime(Timestamp contractTime){
		this.contractTime = contractTime;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "cuid", referencedColumnName="uId")
	public UserPO getCreateUser(){
		return createUser;
	}

	public void setCreateUser(UserPO createUser){
		this.createUser = createUser;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "versionId", referencedColumnName="versionId")
	public QuotationVersionPO getVersion(){
		return version;
	}

	public void setVersion(QuotationVersionPO version){
		this.version = version;
	}

	public float getOrderTotalPrice(){
		return orderTotalPrice;
	}
	
	public void setOrderTotalPrice(float orderTotalPrice){
		this.orderTotalPrice = orderTotalPrice;
	}
	
	public float getFreeArea(){
		return freeArea;
	}
	
	public void setFreeArea(float freeArea){
		this.freeArea = freeArea;
	}
	
	public float getNotSalesmanRate(){
		return notSalesmanRate;
	}
	
	public void setNotSalesmanRate(float notSalesmanRate){
		this.notSalesmanRate = notSalesmanRate;
	}

	public String getSalesmanType(){
		return salesmanType;
	}

	public void setSalesmanType(String salesmanType){
		this.salesmanType = salesmanType;
	}
	
	public int getOtherStatus(){
		return otherStatus;
	}

	public void setOtherStatus(int otherStatus){
		this.otherStatus = otherStatus;
	}

	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	public int getQuotationTimeLimit() {
		return quotationTimeLimit;
	}

	public void setQuotationTimeLimit(int quotationTimeLimit) {
		this.quotationTimeLimit = quotationTimeLimit;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "quId", referencedColumnName="uId")
	public UserPO getQuoter() {
		return quoter;
	}

	public void setQuoter(UserPO quoter) {
		this.quoter = quoter;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "euId", referencedColumnName="uId")
	public UserPO getEscorter() {
		return escorter;
	}

	public void setEscorter(UserPO escorter) {
		this.escorter = escorter;
	}
	
	public int getResourceType() {
		return resourceType;
	}

	public void setResourceType(int resourceType) {
		this.resourceType = resourceType;
	}
	
	public float getQuotationPrice() {
		return quotationPrice;
	}

	public void setQuotationPrice(float quotationPrice) {
		this.quotationPrice = quotationPrice;
	}
	
	public short getPaySacle() {
		return paySacle;
	}

	public void setPaySacle(short paySacle) {
		this.paySacle = paySacle;
	}

	public float getDiscount() {
		return discount;
	}

	public void setDiscount(float discount) {
		this.discount = discount;
	}

	private void ptv(DecorationVO decorationVO){
		BeanUtil.copyProperties(this, decorationVO, Arrays.asList("house","customer","designer","salesman","supervisor","version","createUser","quoter","escorter","contractUserId"));
		
		if(decorationVO.getOrderTotalPrice() == null){
			decorationVO.setOrderTotalPrice(new Float(0));
		}
		
		decorationVO.setHouse(new HouseVO(new VillageVO(new CityProperVO())));
		BeanUtil.copyProperties(this.getHouse(), decorationVO.getHouse(), Arrays.asList("village"));
		BeanUtil.copyProperties(this.getHouse().getVillage(), decorationVO.getHouse().getVillage(), Arrays.asList("cityProper"));		
		BeanUtil.copyProperties(this.getHouse().getVillage().getCityProper(), decorationVO.getHouse().getVillage().getCityProper(), Arrays.asList("city"));	
		
		CustomerVO customerVO = new CustomerVO();
		BeanUtil.copyProperties(this.getCustomer(), customerVO);
		customerVO.setConfidentialInfo();
		decorationVO.setCustomer(customerVO);

		decorationVO.setDesigner(new UserBaseVO());
		decorationVO.setSalesman(new UserBaseVO());
		
		String startWith = SystemConfig.getString("contractStartWith", "FLJ-");
		decorationVO.setContractCode(startWith + this.getOrderId() + "-" + this.getDesigner().getDept().getContractPrefix());
		
		decorationVO.getDesigner().setDuty(new DutyVO());
		decorationVO.getDesigner().setDept(new DepartmentVO());
		decorationVO.getDesigner().getDept().setFatherDept(new DepartmentVO());
		
		BeanUtil.copyPropertie(this.getDesigner(), decorationVO.getDesigner(), Arrays.asList("duty","dept"));
		BeanUtil.copyPropertie(this.getDesigner().getDuty(), decorationVO.getDesigner().getDuty(), Arrays.asList("departmentType"));
		BeanUtil.copyPropertie(this.getDesigner().getDept(), decorationVO.getDesigner().getDept(), Arrays.asList("type","fatherDept","cityProper"));
		BeanUtil.copyPropertie(this.getDesigner().getDept().getFatherDept(), decorationVO.getDesigner().getDept().getFatherDept(), Arrays.asList("type","fatherDept","cityProper"));		
		
		decorationVO.getSalesman().setDuty(new DutyVO());
		decorationVO.getSalesman().setDept(new DepartmentVO());
		decorationVO.getSalesman().getDept().setFatherDept(new DepartmentVO());
		
		BeanUtil.copyPropertie(this.getSalesman(), decorationVO.getSalesman(), Arrays.asList("duty","dept"));
		BeanUtil.copyPropertie(this.getSalesman().getDuty(), decorationVO.getSalesman().getDuty(), Arrays.asList("departmentType"));
		BeanUtil.copyPropertie(this.getSalesman().getDept(), decorationVO.getSalesman().getDept(), Arrays.asList("type","fatherDept","cityProper"));
		BeanUtil.copyPropertie(this.getSalesman().getDept().getFatherDept(), decorationVO.getSalesman().getDept().getFatherDept(), Arrays.asList("type","fatherDept","cityProper"));
		
		decorationVO.setVersion(new QuotationVersionVO());		
		
		BeanUtil.copyPropertie(this.getVersion(), decorationVO.getVersion());	
	}
	
	public void ptvcascade(DecorationVO decorationVO){
		ptv(decorationVO);
		
		if(decorationVO.getSupervisor() != null && this.getSupervisor() != null){
			
			decorationVO.getSupervisor().setDuty(new DutyVO());
			decorationVO.getSupervisor().setDept(new DepartmentVO());
			decorationVO.getSupervisor().getDept().setFatherDept(new DepartmentVO());
			
			BeanUtil.copyPropertie(this.getSupervisor(), decorationVO.getSupervisor(), Arrays.asList("duty","dept"));
			BeanUtil.copyPropertie(this.getSupervisor().getDuty(), decorationVO.getSupervisor().getDuty(), Arrays.asList("departmentType"));
			BeanUtil.copyPropertie(this.getSupervisor().getDept(), decorationVO.getSupervisor().getDept(), Arrays.asList("type","fatherDept","cityProper"));
			BeanUtil.copyPropertie(this.getSupervisor().getDept().getFatherDept(), decorationVO.getSupervisor().getDept().getFatherDept(), Arrays.asList("type","fatherDept","cityProper"));
		}
		
		
		
		if(decorationVO.getCreateUser() != null && this.getCreateUser() != null){
			
			decorationVO.getCreateUser().setDuty(new DutyVO());
			decorationVO.getCreateUser().setDept(new DepartmentVO());
			decorationVO.getCreateUser
			().getDept().setFatherDept(new DepartmentVO());
			
			BeanUtil.copyPropertie(this.getCreateUser(), decorationVO.getCreateUser(), Arrays.asList("duty","dept"));
			BeanUtil.copyPropertie(this.getCreateUser().getDuty(), decorationVO.getCreateUser().getDuty(), Arrays.asList("departmentType"));
			BeanUtil.copyPropertie(this.getCreateUser().getDept(), decorationVO.getCreateUser().getDept(), Arrays.asList("type","fatherDept","cityProper"));
			BeanUtil.copyPropertie(this.getCreateUser().getDept().getFatherDept(), decorationVO.getCreateUser().getDept().getFatherDept(), Arrays.asList("type","fatherDept","cityProper"));
		}
		
		if(decorationVO.getQuoter() != null && this.getQuoter() != null){
			BeanUtil.copyPropertie(this.getQuoter(), decorationVO.getQuoter(), Arrays.asList("duty","dept"));
		}

		
		if(decorationVO.getEscorter() != null && this.getEscorter() != null){
			BeanUtil.copyPropertie(this.getEscorter(), decorationVO.getEscorter(), Arrays.asList("duty","dept"));
		}
	}
	
}
