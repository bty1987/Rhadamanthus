/**
 * @File Name		: MaterialSubOrderVO.java
 * @Package   	: com.fanglin.vo.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-10-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.material.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class MaterialSubOrderVO implements Serializable {

	private static final long serialVersionUID = -5594088406016802739L;
	
	private Long msoId;
	
	private String msoNo;
	
	private String orderId;
	
	private String customerId;
	
	private String customerName;
	
	private String supervisorName;
	
	private String supervisorPhone;
	
	private String orderAddr;
	
	private String salesmanId;
	
	private String salesmanName;
	
	private String materialerId;
	
	private String materialerName;
	
	private String instoreId;
	
	private String instoreName;
	
	private Integer designerFlag;
	
	private Integer packageFlag;
	
	private String materialType;
	
	private String materialBrand;
	
	private String regionId;
	
	private String regionName;
	
	private String departmentId;
	
	private String departmentName;
	
	private String materialDeptId;
	
	private String materialDeptName;
	
	private Timestamp createTime;
	
	private Timestamp preBalanceTime;
	
	private Timestamp postBalanceTime;
	
	private Integer msoType;
	
	private Integer status;
	
	private Float  depositPayment;
	
	private Integer depositStatus;
	
	private Float fullPayment;
	
	private Integer fullStatus;
	
	private Timestamp fullCollectTime;
	
	private Integer deliveryStatus;
	
	private Timestamp deliveryTime;
	
	private String deliveryUserId;
	
	private Integer balanceStatus;
	
	private Integer otherStatus;
	
	private Float base;
	
	private Float point;
	
	private Float total;
	
	private Float distotal;
	
	private Float maling;
	
	private Float venderMaling;
	
	private Float coupon;
	
	private String couponInfo;
	
	private Float profit;
	
	private Float postProfit;
	
	private Float custProfit;
	
	private String des;
	
	private Float refund;
	
	private String refundDes;
	
	private Integer company;

	public Long getMsoId(){
		return msoId;
	}

	public void setMsoId(Long msoId){
		this.msoId = msoId;
	}

	public String getOrderId(){
		return orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}

	public String getMsoNo(){
		return msoNo;
	}

	public void setMsoNo(String msoNo){
		this.msoNo = msoNo;
	}

	public String getOrderAddr(){
		return orderAddr;
	}

	public void setOrderAddr(String orderAddr){
		this.orderAddr = orderAddr;
	}

	public String getSalesmanName(){
		return salesmanName;
	}

	public void setSalesmanName(String salesmanName){
		this.salesmanName = salesmanName;
	}

	public Integer getMsoType(){
		return msoType;
	}

	public void setMsoType(Integer msoType){
		this.msoType = msoType;
	}

	public Integer getStatus(){
		return status;
	}

	public void setStatus(Integer status){
		this.status = status;
	}

	public Integer getDeliveryStatus(){
		return deliveryStatus;
	}

	public void setDeliveryStatus(Integer deliveryStatus){
		this.deliveryStatus = deliveryStatus;
	}

	public Float getTotal(){
		return total;
	}

	public void setTotal(Float total){
		this.total = total;
	}

	public String getDes(){
		return des;
	}

	public void setDes(String des){
		this.des = des;
	}

	public String getRegionId(){
		return regionId;
	}

	public void setRegionId(String regionId){
		this.regionId = regionId;
	}

	public String getDepartmentId(){
		return departmentId;
	}

	public void setDepartmentId(String departmentId){
		this.departmentId = departmentId;
	}

	public String getMaterialDeptId(){
		return materialDeptId;
	}

	public void setMaterialDeptId(String materialDeptId){
		this.materialDeptId = materialDeptId;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime(){
		return createTime;
	}

	public void setCreateTime(Timestamp createTime){
		this.createTime = createTime;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getPreBalanceTime(){
		return preBalanceTime;
	}

	public void setPreBalanceTime(Timestamp preBalanceTime){
		this.preBalanceTime = preBalanceTime;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getPostBalanceTime(){
		return postBalanceTime;
	}

	public void setPostBalanceTime(Timestamp postBalanceTime){
		this.postBalanceTime = postBalanceTime;
	}

	public String getSalesmanId(){
		return salesmanId;
	}

	public void setSalesmanId(String salesmanId){
		this.salesmanId = salesmanId;
	}

	public Float getDepositPayment(){
		return depositPayment;
	}

	public void setDepositPayment(Float depositPayment){
		this.depositPayment = depositPayment;
	}

	public Integer getDepositStatus(){
		return depositStatus;
	}

	public void setDepositStatus(Integer depositStatus){
		this.depositStatus = depositStatus;
	}

	public Float getFullPayment(){
		return fullPayment;
	}

	public void setFullPayment(Float fullPayment){
		this.fullPayment = fullPayment;
	}

	public Integer getFullStatus(){
		return fullStatus;
	}

	public void setFullStatus(Integer fullStatus){
		this.fullStatus = fullStatus;
	}

	public String getCustomerId(){
		return customerId;
	}

	public void setCustomerId(String customerId){
		this.customerId = customerId;
	}

	public String getCustomerName(){
		return customerName;
	}

	public void setCustomerName(String customerName){
		this.customerName = customerName;
	}

	public Integer getBalanceStatus(){
		return balanceStatus;
	}

	public void setBalanceStatus(Integer balanceStatus){
		this.balanceStatus = balanceStatus;
	}

	public Float getPoint(){
		return point;
	}

	public void setPoint(Float point){
		this.point = point;
	}

	public Float getBase(){
		return base;
	}

	public void setBase(Float base){
		this.base = base;
	}

	public String getMaterialerId(){
		return materialerId;
	}

	public void setMaterialerId(String materialerId){
		this.materialerId = materialerId;
	}

	public String getMaterialerName(){
		return materialerName;
	}

	public void setMaterialerName(String materialerName){
		this.materialerName = materialerName;
	}

	public String getRegionName(){
		return regionName;
	}

	public void setRegionName(String regionName){
		this.regionName = regionName;
	}

	public String getDepartmentName(){
		return departmentName;
	}

	public void setDepartmentName(String departmentName){
		this.departmentName = departmentName;
	}

	public String getMaterialDeptName(){
		return materialDeptName;
	}

	public void setMaterialDeptName(String materialDeptName){
		this.materialDeptName = materialDeptName;
	}

	public Integer getPackageFlag(){
		return packageFlag;
	}

	public void setPackageFlag(Integer packageFlag){
		this.packageFlag = packageFlag;
	}

	public Integer getDesignerFlag(){
		return designerFlag;
	}

	public void setDesignerFlag(Integer designerFlag){
		this.designerFlag = designerFlag;
	}

	public Float getMaling(){
		return maling;
	}

	public void setMaling(Float maling){
		this.maling = maling;
	}

	public Float getVenderMaling(){
		return venderMaling;
	}

	public void setVenderMaling(Float venderMaling){
		this.venderMaling = venderMaling;
	}

	public String getInstoreId(){
		return instoreId;
	}

	public void setInstoreId(String instoreId){
		this.instoreId = instoreId;
	}

	public String getInstoreName(){
		return instoreName;
	}

	public void setInstoreName(String instoreName){
		this.instoreName = instoreName;
	}

	public Float getCoupon(){
		return coupon;
	}

	public void setCoupon(Float coupon){
		this.coupon = coupon;
	}

	public String getCouponInfo(){
		return couponInfo;
	}

	public void setCouponInfo(String couponInfo){
		this.couponInfo = couponInfo;
	}

	public String getMaterialType(){
		return materialType;
	}

	public void setMaterialType(String materialType){
		this.materialType = materialType;
	}

	public String getMaterialBrand(){
		return materialBrand;
	}

	public void setMaterialBrand(String materialBrand){
		this.materialBrand = materialBrand;
	}

	public Float getRefund(){
		return refund;
	}

	public void setRefund(Float refund){
		this.refund = refund;
	}

	public String getRefundDes(){
		return refundDes;
	}

	public void setRefundDes(String refundDes){
		this.refundDes = refundDes;
	}

	public String getSupervisorName(){
		return supervisorName;
	}

	public void setSupervisorName(String supervisorName){
		this.supervisorName = supervisorName;
	}

	public String getSupervisorPhone(){
		return supervisorPhone;
	}

	public void setSupervisorPhone(String supervisorPhone){
		this.supervisorPhone = supervisorPhone;
	}

	public Float getProfit(){
		return profit;
	}

	public void setProfit(Float profit){
		this.profit = profit;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getFullCollectTime() {
		return fullCollectTime;
	}

	public void setFullCollectTime(Timestamp fullCollectTime) {
		this.fullCollectTime = fullCollectTime;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getDeliveryTime() {
		return deliveryTime;
	}

	public void setDeliveryTime(Timestamp deliveryTime) {
		this.deliveryTime = deliveryTime;
	}

	public void setDeliveryStatus(int deliveryStatus) {
		this.deliveryStatus = deliveryStatus;
	}

	public String getDeliveryUserId() {
		return deliveryUserId;
	}

	public void setDeliveryUserId(String deliveryUserId) {
		this.deliveryUserId = deliveryUserId;
	}

	public Float getPostProfit() {
		return postProfit;
	}

	public void setPostProfit(Float postProfit) {
		this.postProfit = postProfit;
	}

	public Integer getOtherStatus() {
		return otherStatus;
	}

	public void setOtherStatus(Integer otherStatus) {
		this.otherStatus = otherStatus;
	}

	public Float getCustProfit() {
		return custProfit;
	}

	public void setCustProfit(Float custProfit) {
		this.custProfit = custProfit;
	}

	public Float getDistotal() {
		return distotal;
	}

	public void setDistotal(Float distotal) {
		this.distotal = distotal;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	

}
