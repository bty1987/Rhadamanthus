/**
 * @File Name		: ApprovalBelongTranItemVO.java
 * @Package   	: com.fanglin.approval.vo
 * @Version		: 1.0
 * @Date			: 2026-11-11
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 离职移交审批明细VO(接手人/rate/默认人均为modal人工编辑值)
 */

package com.fanglin.approval.vo;

public class ApprovalBelongTranItemVO implements java.io.Serializable {

	private static final long serialVersionUID = -3348056190273146520L;

	private Integer abtiId;

	private Integer abtId;

	private String orderId;

	private Short belongType; // 0设计 1业务

	private String userId; // 接手人userId

	private Integer bdid;

	private Integer brid;

	private Integer rate; // 千分率0~1000

	private Short defaultFlag;

	// 详情展示装配字段
	private String userName; // 接手人姓名

	private String deptName;

	private String regionName;

	private String customerName; // 装修单客户

	private Short status; // 装修单状态

	private String statusName;

	private String belongTypeName; // 设计/业务文本

	private String defaultFlagName; // 默认/否文本

	private String rateText; // 比例百分比文本(500→50%)

	public Integer getAbtiId() {
		return abtiId;
	}

	public void setAbtiId(Integer abtiId) {
		this.abtiId = abtiId;
	}

	public Integer getAbtId() {
		return abtId;
	}

	public void setAbtId(Integer abtId) {
		this.abtId = abtId;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Short getBelongType() {
		return belongType;
	}

	public void setBelongType(Short belongType) {
		this.belongType = belongType;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public Integer getBdid() {
		return bdid;
	}

	public void setBdid(Integer bdid) {
		this.bdid = bdid;
	}

	public Integer getBrid() {
		return brid;
	}

	public void setBrid(Integer brid) {
		this.brid = brid;
	}

	public Integer getRate() {
		return rate;
	}

	public void setRate(Integer rate) {
		this.rate = rate;
	}

	public Short getDefaultFlag() {
		return defaultFlag;
	}

	public void setDefaultFlag(Short defaultFlag) {
		this.defaultFlag = defaultFlag;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getDeptName() {
		return deptName;
	}

	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}

	public String getRegionName() {
		return regionName;
	}

	public void setRegionName(String regionName) {
		this.regionName = regionName;
	}

	public String getCustomerName() {
		return customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public String getStatusName() {
		return statusName;
	}

	public void setStatusName(String statusName) {
		this.statusName = statusName;
	}

	public String getBelongTypeName() {
		return belongTypeName;
	}

	public void setBelongTypeName(String belongTypeName) {
		this.belongTypeName = belongTypeName;
	}

	public String getDefaultFlagName() {
		return defaultFlagName;
	}

	public void setDefaultFlagName(String defaultFlagName) {
		this.defaultFlagName = defaultFlagName;
	}

	public String getRateText() {
		return rateText;
	}

	public void setRateText(String rateText) {
		this.rateText = rateText;
	}

}
