/**
 * @File Name		: DecorationExportVO.java
 * @Package   	: com.fanglin.decoration.vo
 * @Version		: 1.0
 * @Date			: 2015-5-30
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.exports.vo;

import java.io.Serializable;
import java.sql.Timestamp;

public class DecorationExportVO implements Serializable, Cloneable{

	private static final long serialVersionUID = -9025344317013276874L;
	
	private String orderId;
	
	private String orderAddr;
	
	private Timestamp contractTime;
	
	private String merge;
	
	private Short giveup;
	
	private String activity;
	
	private Float notSalesmanCut;
	
	private Float notSalesmanRate;
	
	private Float contractPrice;
	
	private String userId;
	
	private String operateUserId;
	
	private String operateUserName;
	
	private String operateType;
	
	private String departmentId;
	
	private String department;
	
	private String regionId;
	
	private String region;
	
	private Float rate;
	
	private Float discount;
	
	private Float latexCut;
	
	private Float managePrice;
	
	private Float manageRate;
	
	private Float trafficPrice;
	
	private Float designPayment;
	
	private String designPaymentStatus;
	
	private Float firstPayment;
	
	private Timestamp firstCollectTime;
	
	private Float firstSecondPayment;
	
	private Timestamp firstSecondCollectTime;
	
	private Float secondPayment;
	
	private Timestamp secondCollectTime;
	
	private Float thirdPayment;
	
	private Timestamp thirdCollectTime;
	
	private Float penalty;
	
	private Float advancePayment;
	
	private Float achievement; // 净业绩
	
	private Float unpayPayment;
	
	private String salesmanType;
	
	private String supervisor;
	
	private Float houseArea;

	@Override
	public Object clone() throws CloneNotSupportedException {
		return super.clone();
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getOrderAddr() {
		return orderAddr;
	}

	public void setOrderAddr(String orderAddr) {
		this.orderAddr = orderAddr;
	}

	public Timestamp getContractTime() {
		return contractTime;
	}

	public void setContractTime(Timestamp contractTime) {
		this.contractTime = contractTime;
	}

	public String getMerge() {
		return merge;
	}

	public void setMerge(String merge) {
		this.merge = merge;
	}

	public Short getGiveup() {
		return giveup;
	}

	public void setGiveup(Short giveup) {
		this.giveup = giveup;
	}

	public String getActivity() {
		return activity;
	}

	public void setActivity(String activity) {
		this.activity = activity;
	}

	public Float getNotSalesmanCut() {
		return notSalesmanCut;
	}

	public void setNotSalesmanCut(Float notSalesmanCut) {
		this.notSalesmanCut = notSalesmanCut;
	}

	public Float getNotSalesmanRate() {
		return notSalesmanRate;
	}

	public void setNotSalesmanRate(Float notSalesmanRate) {
		this.notSalesmanRate = notSalesmanRate;
	}

	public Float getContractPrice() {
		return contractPrice;
	}

	public void setContractPrice(Float contractPrice) {
		this.contractPrice = contractPrice;
	}

	public String getOperateUserId() {
		return operateUserId;
	}

	public void setOperateUserId(String operateUserId) {
		this.operateUserId = operateUserId;
	}

	public String getOperateUserName() {
		return operateUserName;
	}

	public void setOperateUserName(String operateUserName) {
		this.operateUserName = operateUserName;
	}

	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

	public String getRegion() {
		return region;
	}

	public void setRegion(String region) {
		this.region = region;
	}

	public Float getRate() {
		return rate;
	}

	public void setRate(Float rate) {
		this.rate = rate;
	}

	public Float getDiscount() {
		return discount;
	}

	public void setDiscount(Float discount) {
		this.discount = discount;
	}

	public Float getLatexCut() {
		return latexCut;
	}

	public void setLatexCut(Float latexCut) {
		this.latexCut = latexCut;
	}

	public Float getManagePrice() {
		return managePrice;
	}

	public void setManagePrice(Float managePrice) {
		this.managePrice = managePrice;
	}

	public Float getManageRate() {
		return manageRate;
	}

	public void setManageRate(Float manageRate) {
		this.manageRate = manageRate;
	}

	public Float getTrafficPrice() {
		return trafficPrice;
	}

	public void setTrafficPrice(Float trafficPrice) {
		this.trafficPrice = trafficPrice;
	}

	public Float getDesignPayment() {
		return designPayment;
	}

	public void setDesignPayment(Float designPayment) {
		this.designPayment = designPayment;
	}

	public Float getFirstPayment() {
		return firstPayment;
	}

	public void setFirstPayment(Float firstPayment) {
		this.firstPayment = firstPayment;
	}

	public Timestamp getFirstCollectTime() {
		return firstCollectTime;
	}

	public void setFirstCollectTime(Timestamp firstCollectTime) {
		this.firstCollectTime = firstCollectTime;
	}

	public Float getFirstSecondPayment() {
		return firstSecondPayment;
	}

	public void setFirstSecondPayment(Float firstSecondPayment) {
		this.firstSecondPayment = firstSecondPayment;
	}

	public Timestamp getFirstSecondCollectTime() {
		return firstSecondCollectTime;
	}

	public void setFirstSecondCollectTime(Timestamp firstSecondCollectTime) {
		this.firstSecondCollectTime = firstSecondCollectTime;
	}

	public Float getSecondPayment() {
		return secondPayment;
	}

	public void setSecondPayment(Float secondPayment) {
		this.secondPayment = secondPayment;
	}

	public Timestamp getSecondCollectTime() {
		return secondCollectTime;
	}

	public void setSecondCollectTime(Timestamp secondCollectTime) {
		this.secondCollectTime = secondCollectTime;
	}

	public Float getThirdPayment() {
		return thirdPayment;
	}

	public void setThirdPayment(Float thirdPayment) {
		this.thirdPayment = thirdPayment;
	}

	public Timestamp getThirdCollectTime() {
		return thirdCollectTime;
	}

	public void setThirdCollectTime(Timestamp thirdCollectTime) {
		this.thirdCollectTime = thirdCollectTime;
	}

	public Float getPenalty() {
		return penalty;
	}

	public void setPenalty(Float penalty) {
		this.penalty = penalty;
	}

	public Float getAdvancePayment() {
		return advancePayment;
	}

	public void setAdvancePayment(Float advancePayment) {
		this.advancePayment = advancePayment;
	}

	public Float getAchievement() {
		return achievement;
	}

	public void setAchievement(Float achievement) {
		this.achievement = achievement;
	}

	public Float getUnpayPayment() {
		return unpayPayment;
	}

	public void setUnpayPayment(Float unpayPayment) {
		this.unpayPayment = unpayPayment;
	}

	public String getOperateType() {
		return operateType;
	}

	public void setOperateType(String operateType) {
		this.operateType = operateType;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getDepartmentId() {
		return departmentId;
	}

	public void setDepartmentId(String departmentId) {
		this.departmentId = departmentId;
	}

	public String getRegionId() {
		return regionId;
	}

	public void setRegionId(String regionId) {
		this.regionId = regionId;
	}

	public String getSalesmanType() {
		return salesmanType;
	}

	public void setSalesmanType(String salesmanType) {
		this.salesmanType = salesmanType;
	}

	public String getSupervisor() {
		return supervisor;
	}

	public void setSupervisor(String supervisor) {
		this.supervisor = supervisor;
	}

	public Float getHouseArea() {
		return houseArea;
	}

	public void setHouseArea(Float houseArea) {
		this.houseArea = houseArea;
	}

	public String getDesignPaymentStatus() {
		return designPaymentStatus;
	}

	public void setDesignPaymentStatus(String designPaymentStatus) {
		this.designPaymentStatus = designPaymentStatus;
	}
	
}
