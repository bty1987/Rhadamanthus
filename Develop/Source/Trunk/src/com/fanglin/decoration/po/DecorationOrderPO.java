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

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.data.po.CustomerPO;
import com.fanglin.data.po.QuotationVersionPO;
import com.fanglin.data.po.VillagePO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "decorationOrder", catalog = "platform")
public class DecorationOrderPO implements Serializable {

	private static final long serialVersionUID = -5971474052433500262L;
	
	public static final String STATUS_CONSULT_STR = "咨询";
	
	public static final String STATUS_AMOUNT_STR = "量房";
	
	public static final String STATUS_QUOTATION_STR = "已报价";
	
	public static final String STATUS_DEPOSIT_STR = "定金";
	
	public static final String STATUS_RESIGNED_STR = "重签合同";
	
	public static final String STATUS_SIGNED_STR = "已签约";
	
	public static final String STATUS_WASTE_STR = "废单";
	
	public static final String STATUS_COMPLETED_STR = "已完工";
	
	public static final String STATUS_TERMINATION_STR = "合同终止";
	
	public static final String PROJECTSTATUS_WAITING_STR = "等待施工";
	
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
	
	private Long autoId;
	
	private String orderId;
	
	private CustomerPO customerPO;
	
	private VillagePO villagePO;
	
	private String houseNumber;
	
	private String houseType;
	
	private String houseClass;
	
	private String apartmentType;
	
	private Float houseArea;
	
	private Float freeArea;
	
	private UserPO designerPO;
	
	private UserPO salesmanPO;
	
	private UserPO supervisorPO;
	
	private UserPO inspectionPO;
	
	private String notSalesmanName;
	
	private String notSalesmanPhone;
	
	private String notSalesmanContent;
	
	private String backOrderName;
	
	private String backOrderPhone;
	
	private String backOrderContent;
	
	private String contractCode;
	
	private Timestamp contractTime;
	
	private String contractUserId;
	
	private Timestamp measureTime;
	
	private Timestamp depositTime;
	
	private Timestamp createTime;
	
	private String status;
	
	private short type;
	
	private String projectStatus;
	
	private String paymentStatus;
	
	private Integer otherStatus;
	
	private QuotationVersionPO versionPO;
	
	private UserPO createUserPO;
	
	private Float orderTotalPrice;

	private Float notSalesmanRate = 0f;
	
	private String salesmanType = "守园";
	
	private int company;
	
	private int quotationTimeLimit;
	
	public DecorationOrderPO(){}
	
	public DecorationOrderPO(String orderId) {
		super();
		this.orderId = orderId;
	}

	@GeneratedValue
	public Long getAutoId(){
		return autoId;
	}

	public void setAutoId(Long autoId){
		this.autoId = autoId;
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
	@JoinColumn(nullable = false, name = "customerId",referencedColumnName="id")
	public CustomerPO getCustomerPO(){
		return customerPO;
	}

	public void setCustomerPO(CustomerPO customerPO){
		this.customerPO = customerPO;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "villageId", referencedColumnName="villageId")
	public VillagePO getVillagePO(){
		return villagePO;
	}

	public void setVillagePO(VillagePO villagePO){
		this.villagePO = villagePO;
	}

	public String getHouseNumber(){
		return houseNumber;
	}

	public void setHouseNumber(String houseNumber){
		this.houseNumber = houseNumber;
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

	public Float getHouseArea(){
		return houseArea;
	}

	public void setHouseArea(Float houseArea){
		this.houseArea = houseArea;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "designerId", referencedColumnName="userId")
	public UserPO getDesignerPO(){
		return designerPO;
	}

	public void setDesignerPO(UserPO designerPO){
		this.designerPO = designerPO;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "salesmanId", referencedColumnName="userId")
	public UserPO getSalesmanPO(){
		return salesmanPO;
	}

	public void setSalesmanPO(UserPO salesmanPO){
		this.salesmanPO = salesmanPO;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "supervisorId", referencedColumnName="userId")
	public UserPO getSupervisorPO(){
		return supervisorPO;
	}

	public void setSupervisorPO(UserPO supervisorPO){
		this.supervisorPO = supervisorPO;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "inspectionId", referencedColumnName="userId")
	public UserPO getInspectionPO(){
		return inspectionPO;
	}

	public void setInspectionPO(UserPO inspectionPO){
		this.inspectionPO = inspectionPO;
	}

	public String getNotSalesmanPhone(){
		return notSalesmanPhone;
	}

	public void setNotSalesmanPhone(String notSalesmanPhone){
		this.notSalesmanPhone = notSalesmanPhone;
	}

	public String getNotSalesmanContent(){
		return notSalesmanContent;
	}

	public void setNotSalesmanContent(String notSalesmanContent){
		this.notSalesmanContent = notSalesmanContent;
	}

	public String getBackOrderPhone(){
		return backOrderPhone;
	}

	public void setBackOrderPhone(String backOrderPhone){
		this.backOrderPhone = backOrderPhone;
	}

	public String getBackOrderContent(){
		return backOrderContent;
	}

	public void setBackOrderContent(String backOrderContent){
		this.backOrderContent = backOrderContent;
	}

	public String getContractCode(){
		return contractCode;
	}

	public void setContractCode(String contractCode){
		this.contractCode = contractCode;
	}
	
	public String getContractUserId() {
		return contractUserId;
	}

	public void setContractUserId(String contractUserId) {
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

	public String getStatus(){
		return status;
	}

	public void setStatus(String status){
		this.status = status;
	}

	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	public String getProjectStatus(){
		return projectStatus;
	}

	public void setProjectStatus(String projectStatus){
		this.projectStatus = projectStatus;
	}

	public String getPaymentStatus(){
		return paymentStatus;
	}

	public void setPaymentStatus(String paymentStatus){
		this.paymentStatus = paymentStatus;
	}

	public void setNotSalesmanName(String notSalesmanName){
		this.notSalesmanName = notSalesmanName;
	}

	public String getNotSalesmanName(){
		return notSalesmanName;
	}

	public void setBackOrderName(String backOrderName){
		this.backOrderName = backOrderName;
	}

	public String getBackOrderName(){
		return backOrderName;
	}

	public void setContractTime(Timestamp contractTime){
		this.contractTime = contractTime;
	}

	public Timestamp getContractTime(){
		return contractTime;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "createUser", referencedColumnName="userId")
	public UserPO getCreateUserPO(){
		return createUserPO;
	}

	public void setCreateUserPO(UserPO createUserPO){
		this.createUserPO = createUserPO;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "versionId", referencedColumnName="versionId")
	public QuotationVersionPO getVersionPO(){
		return versionPO;
	}

	public void setVersionPO(QuotationVersionPO versionPO){
		this.versionPO = versionPO;
	}

	public void setOrderTotalPrice(Float orderTotalPrice){
		this.orderTotalPrice = orderTotalPrice;
	}

	public Float getOrderTotalPrice(){
		return orderTotalPrice;
	}
	
	public void setFreeArea(Float freeArea){
		this.freeArea = freeArea;
	}
	
	public Float getFreeArea(){
		return freeArea;
	}
	
	public void setNotSalesmanRate(Float notSalesmanRate){
		this.notSalesmanRate = notSalesmanRate;
	}
	
	public Float getNotSalesmanRate(){
		return notSalesmanRate;
	}
	
	public void setSalesmanType(String salesmanType){
		this.salesmanType = salesmanType;
	}
	
	public String getSalesmanType(){
		return salesmanType;
	}
	
	public Integer getOtherStatus(){
		return otherStatus;
	}

	public void setOtherStatus(Integer otherStatus){
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

}
