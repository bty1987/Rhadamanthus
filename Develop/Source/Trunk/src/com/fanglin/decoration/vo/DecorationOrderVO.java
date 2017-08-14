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

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.data.common.vo.CustomerVO;
import com.fanglin.data.common.vo.VillageVO;

public class DecorationOrderVO implements Serializable {

	private static final long serialVersionUID = 1112545655558888L;
	
	private Long autoId;
	
	private String orderId;
	
	private CustomerVO customer;
	
	private VillageVO village;
	
	private String houseNumber;
	
	private String houseType;
	
	private String houseClass;
	
	private String apartmentType;
	
	private Float houseArea;
	
	private Float freeArea;
	
	private String designer;
	
	private String designerPhone;
	
	private String designDepartment;
	
	private String designRegion;
	
	private String salesman;
	
	private String salesmanPhone;
	
	private String businessDepartment;
	
	private String supervisor;
	
	private String supervisorPhone;
	
	private String inspection;
	
	private String designerId;
	
	private String salesmanId;
	
	private String supervisorId;
	
	private String inspectionId;
	
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
	
	private Timestamp createTime;
	
	private String status;
	
	private Short type;
	
	private String projectStatus;
	
	private String paymentStatus;
	
	private Integer otherStatus;
	
	private String versionId;
	
	private String versionName;
	
	private Float discount; 
	
	private String createUser;
	
	private String createUserId;
	
	private Float orderTotalPrice;
	
	private Float notSalesmanRate;

	private String salesmanType;
	
	public String getOrderId(){
		return orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}

	public CustomerVO getCustomer(){
		return customer;
	}

	public void setCustomer(CustomerVO customer){
		this.customer = customer;
	}

	public VillageVO getVillage(){
		return village;
	}

	public void setVillage(VillageVO village){
		this.village = village;
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

	public String getDesigner(){
		return designer;
	}

	public void setDesigner(String designer){
		this.designer = designer;
	}

	public String getDesignerPhone() {
		return designerPhone;
	}

	public void setDesignerPhone(String designerPhone) {
		this.designerPhone = designerPhone;
	}

	public String getSalesman(){
		return salesman;
	}

	public void setSalesman(String salesman){
		this.salesman = salesman;
	}

	public String getSalesmanPhone() {
		return salesmanPhone;
	}

	public void setSalesmanPhone(String salesmanPhone) {
		this.salesmanPhone = salesmanPhone;
	}

	public String getSupervisor(){
		return supervisor;
	}

	public void setSupervisor(String supervisor){
		this.supervisor = supervisor;
	}

	public String getSupervisorPhone() {
		return supervisorPhone;
	}

	public void setSupervisorPhone(String supervisorPhone) {
		this.supervisorPhone = supervisorPhone;
	}

	public String getInspection(){
		return inspection;
	}

	public void setInspection(String inspection){
		this.inspection = inspection;
	}

	public String getDesignerId(){
		return designerId;
	}

	public void setDesignerId(String designerId){
		this.designerId = designerId;
	}

	public String getSalesmanId(){
		return salesmanId;
	}

	public void setSalesmanId(String salesmanId){
		this.salesmanId = salesmanId;
	}
	
	public String getSupervisorId() {
		return supervisorId;
	}

	public void setSupervisorId(String supervisorId) {
		this.supervisorId = supervisorId;
	}

	public String getInspectionId() {
		return inspectionId;
	}

	public void setInspectionId(String inspectionId) {
		this.inspectionId = inspectionId;
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

	@JSON(format="yyyy-MM-dd")
	public Timestamp getMeasureTime(){
		return measureTime;
	}

	public void setMeasureTime(Timestamp measureTime){
		this.measureTime = measureTime;
	}

	@JSON(format="yyyy-MM-dd")
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

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
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

	public void setVersionId(String versionId){
		this.versionId = versionId;
	}

	public String getVersionId(){
		return versionId;
	}

	public void setDesignDepartment(String designDepartment){
		this.designDepartment = designDepartment;
	}

	public String getDesignDepartment(){
		return designDepartment;
	}

	public String getDesignRegion(){
		return designRegion;
	}

	public void setDesignRegion(String designRegion){
		this.designRegion = designRegion;
	}

	public void setBusinessDepartment(String businessDepartment){
		this.businessDepartment = businessDepartment;
	}

	public String getBusinessDepartment(){
		return businessDepartment;
	}

	public void setContractTime(Timestamp contractTime){
		this.contractTime = contractTime;
	}

	public String getContractUserId() {
		return contractUserId;
	}

	public void setContractUserId(String contractUserId) {
		this.contractUserId = contractUserId;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getContractTime(){
		return contractTime;
	}

	public String getCreateUser(){
		return createUser;
	}

	public void setCreateUser(String createUser){
		this.createUser = createUser;
	}

	public String getCreateUserId(){
		return createUserId;
	}

	public void setCreateUserId(String createUserId){
		this.createUserId = createUserId;
	}

	public void setVersionName(String versionName){
		this.versionName = versionName;
	}

	public String getVersionName(){
		return versionName;
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

	public Float getDiscount(){
		return discount;
	}

	public void setDiscount(Float discount){
		this.discount = discount;
	}

	public Long getAutoId(){
		return autoId;
	}

	public void setAutoId(Long autoId){
		this.autoId = autoId;
	}
}
