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

public class DecorationExportVO implements Serializable, Cloneable {

	private static final long serialVersionUID = -9025344317013276874L;

	private String orderId;

	private String orderAddr;

	private Timestamp contractTime;

	private String merge;

	private Short giveup;

	private String activity;

	private Integer notSalesmanRate;

	private Long notSalesmanCut;

	private Long contractPrice;

	private String userId;

	private String operateUserId;

	private String operateUserName;

	private String operateType;

	private String departmentId;

	private String department;

	private String regionId;

	private String region;

	private Integer rate;

	private Integer discount;

	private Long latexCut;

	private Long managePrice;

	private Integer manageRate;

	private Long trafficPrice;

	private Long designPayment;

	private String designPaymentStatus;

	private Long firstPayment;

	private Timestamp firstCollectTime;

	private Long firstSecondPayment;

	private Timestamp firstSecondCollectTime;

	private Long secondPayment;

	private Timestamp secondCollectTime;

	private Long thirdPayment;

	private Timestamp thirdCollectTime;

	private Long penalty;

	private Long advancePayment;

	private Long achievement; // 净业绩

	private Long unpayPayment;

	private String salesmanType;

	private String supervisor;

	private Integer houseArea;

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

	public Long getNotSalesmanCut() {
		return notSalesmanCut;
	}

	public void setNotSalesmanCut(Long notSalesmanCut) {
		this.notSalesmanCut = notSalesmanCut;
	}

	public Integer getNotSalesmanRate() {
		return notSalesmanRate;
	}

	public void setNotSalesmanRate(Integer notSalesmanRate) {
		this.notSalesmanRate = notSalesmanRate;
	}

	public Long getContractPrice() {
		return contractPrice;
	}

	public void setContractPrice(Long contractPrice) {
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

	public Integer getRate() {
		return rate;
	}

	public void setRate(Integer rate) {
		this.rate = rate;
	}

	public Integer getDiscount() {
		return discount;
	}

	public void setDiscount(Integer discount) {
		this.discount = discount;
	}

	public Long getLatexCut() {
		return latexCut;
	}

	public void setLatexCut(Long latexCut) {
		this.latexCut = latexCut;
	}

	public Long getManagePrice() {
		return managePrice;
	}

	public void setManagePrice(Long managePrice) {
		this.managePrice = managePrice;
	}

	public Integer getManageRate() {
		return manageRate;
	}

	public void setManageRate(Integer manageRate) {
		this.manageRate = manageRate;
	}

	public Long getTrafficPrice() {
		return trafficPrice;
	}

	public void setTrafficPrice(Long trafficPrice) {
		this.trafficPrice = trafficPrice;
	}

	public Long getDesignPayment() {
		return designPayment;
	}

	public void setDesignPayment(Long designPayment) {
		this.designPayment = designPayment;
	}

	public Long getFirstPayment() {
		return firstPayment;
	}

	public void setFirstPayment(Long firstPayment) {
		this.firstPayment = firstPayment;
	}

	public Timestamp getFirstCollectTime() {
		return firstCollectTime;
	}

	public void setFirstCollectTime(Timestamp firstCollectTime) {
		this.firstCollectTime = firstCollectTime;
	}

	public Long getFirstSecondPayment() {
		return firstSecondPayment;
	}

	public void setFirstSecondPayment(Long firstSecondPayment) {
		this.firstSecondPayment = firstSecondPayment;
	}

	public Timestamp getFirstSecondCollectTime() {
		return firstSecondCollectTime;
	}

	public void setFirstSecondCollectTime(Timestamp firstSecondCollectTime) {
		this.firstSecondCollectTime = firstSecondCollectTime;
	}

	public Long getSecondPayment() {
		return secondPayment;
	}

	public void setSecondPayment(Long secondPayment) {
		this.secondPayment = secondPayment;
	}

	public Timestamp getSecondCollectTime() {
		return secondCollectTime;
	}

	public void setSecondCollectTime(Timestamp secondCollectTime) {
		this.secondCollectTime = secondCollectTime;
	}

	public Long getThirdPayment() {
		return thirdPayment;
	}

	public void setThirdPayment(Long thirdPayment) {
		this.thirdPayment = thirdPayment;
	}

	public Timestamp getThirdCollectTime() {
		return thirdCollectTime;
	}

	public void setThirdCollectTime(Timestamp thirdCollectTime) {
		this.thirdCollectTime = thirdCollectTime;
	}

	public Long getPenalty() {
		return penalty;
	}

	public void setPenalty(Long penalty) {
		this.penalty = penalty;
	}

	public Long getAdvancePayment() {
		return advancePayment;
	}

	public void setAdvancePayment(Long advancePayment) {
		this.advancePayment = advancePayment;
	}

	public Long getAchievement() {
		return achievement;
	}

	public void setAchievement(Long achievement) {
		this.achievement = achievement;
	}

	public Long getUnpayPayment() {
		return unpayPayment;
	}

	public void setUnpayPayment(Long unpayPayment) {
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

	public Integer getHouseArea() {
		return houseArea;
	}

	public void setHouseArea(Integer houseArea) {
		this.houseArea = houseArea;
	}

	public String getDesignPaymentStatus() {
		return designPaymentStatus;
	}

	public void setDesignPaymentStatus(String designPaymentStatus) {
		this.designPaymentStatus = designPaymentStatus;
	}

}
