/**
 * @File Name		: DecorationOrderExportVO.java
 * @Package   	: com.fanglin.decoration.vo
 * @Version		: 1.0
 * @Date			: 2015-5-30
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.vo;

import java.io.Serializable;
import java.sql.Timestamp;

public class DecorationOrderExportVO implements Serializable, Cloneable{

	private static final long serialVersionUID = -9025344317013276874L;
	
	private String orderId;
	
	private String orderAddr;
	
	private Timestamp contractTime;
	
	private String merge;
	
	private String giveup;
	
	private String activity;
	
	private float notSalesmanCut;
	
	private float notSalesmanRate;
	
	private float contractPrice;
	
	private String userId;
	
	private String operateUserId;
	
	private String operateUserName;
	
	private String operateType;
	
	private String departmentId;
	
	private String department;
	
	private String regionId;
	
	private String region;
	
	private float rate;
	
	private float discount;
	
	private float latexCut;
	
	private float managePrice;
	
	private float manageRate;
	
	private float trafficPrice;
	
	private float designPayment;
	
	private float firstPayment;
	
	private Timestamp firstCollectTime;
	
	private float firstSecondPayment;
	
	private Timestamp firstSecondCollectTime;
	
	private float secondPayment;
	
	private Timestamp secondCollectTime;
	
	private float thirdPayment;
	
	private Timestamp thirdCollectTime;
	
	private float penalty;
	
	private float advancePayment;
	
	private float achievement; // 净业绩
	
	private float unpayPayment;
	
	private String salesmanType;

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

	public String getGiveup() {
		return giveup;
	}

	public void setGiveup(String giveup) {
		this.giveup = giveup;
	}

	public String getActivity() {
		return activity;
	}

	public void setActivity(String activity) {
		this.activity = activity;
	}

	public float getNotSalesmanCut() {
		return notSalesmanCut;
	}

	public void setNotSalesmanCut(float notSalesmanCut) {
		this.notSalesmanCut = notSalesmanCut;
	}

	public float getNotSalesmanRate() {
		return notSalesmanRate;
	}

	public void setNotSalesmanRate(float notSalesmanRate) {
		this.notSalesmanRate = notSalesmanRate;
	}

	public float getContractPrice() {
		return contractPrice;
	}

	public void setContractPrice(float contractPrice) {
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

	public float getRate() {
		return rate;
	}

	public void setRate(float rate) {
		this.rate = rate;
	}

	public float getDiscount() {
		return discount;
	}

	public void setDiscount(float discount) {
		this.discount = discount;
	}

	public float getLatexCut() {
		return latexCut;
	}

	public void setLatexCut(float latexCut) {
		this.latexCut = latexCut;
	}

	public float getManagePrice() {
		return managePrice;
	}

	public void setManagePrice(float managePrice) {
		this.managePrice = managePrice;
	}

	public float getManageRate() {
		return manageRate;
	}

	public void setManageRate(float manageRate) {
		this.manageRate = manageRate;
	}

	public float getTrafficPrice() {
		return trafficPrice;
	}

	public void setTrafficPrice(float trafficPrice) {
		this.trafficPrice = trafficPrice;
	}

	public float getDesignPayment() {
		return designPayment;
	}

	public void setDesignPayment(float designPayment) {
		this.designPayment = designPayment;
	}

	public float getFirstPayment() {
		return firstPayment;
	}

	public void setFirstPayment(float firstPayment) {
		this.firstPayment = firstPayment;
	}

	public Timestamp getFirstCollectTime() {
		return firstCollectTime;
	}

	public void setFirstCollectTime(Timestamp firstCollectTime) {
		this.firstCollectTime = firstCollectTime;
	}

	public float getFirstSecondPayment() {
		return firstSecondPayment;
	}

	public void setFirstSecondPayment(float firstSecondPayment) {
		this.firstSecondPayment = firstSecondPayment;
	}

	public Timestamp getFirstSecondCollectTime() {
		return firstSecondCollectTime;
	}

	public void setFirstSecondCollectTime(Timestamp firstSecondCollectTime) {
		this.firstSecondCollectTime = firstSecondCollectTime;
	}

	public float getSecondPayment() {
		return secondPayment;
	}

	public void setSecondPayment(float secondPayment) {
		this.secondPayment = secondPayment;
	}

	public Timestamp getSecondCollectTime() {
		return secondCollectTime;
	}

	public void setSecondCollectTime(Timestamp secondCollectTime) {
		this.secondCollectTime = secondCollectTime;
	}

	public float getThirdPayment() {
		return thirdPayment;
	}

	public void setThirdPayment(float thirdPayment) {
		this.thirdPayment = thirdPayment;
	}

	public Timestamp getThirdCollectTime() {
		return thirdCollectTime;
	}

	public void setThirdCollectTime(Timestamp thirdCollectTime) {
		this.thirdCollectTime = thirdCollectTime;
	}

	public float getPenalty() {
		return penalty;
	}

	public void setPenalty(float penalty) {
		this.penalty = penalty;
	}

	public float getAdvancePayment() {
		return advancePayment;
	}

	public void setAdvancePayment(float advancePayment) {
		this.advancePayment = advancePayment;
	}

	public float getAchievement() {
		return achievement;
	}

	public void setAchievement(float achievement) {
		this.achievement = achievement;
	}

	public float getUnpayPayment() {
		return unpayPayment;
	}

	public void setUnpayPayment(float unpayPayment) {
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
	
}
