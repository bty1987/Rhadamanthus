package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserVO;

public class FeedbackGuaranteeVO implements Serializable {

	private static final long serialVersionUID = 4233452556173158703L;

	private Long fgid;

	private Long fid;

	private String orderId;

	private Short source;

	private String phone;

	private Short cutomerType;

	private String deptType;

	private String workType;

	private String bids;

	private String brands;

	private UserVO creater;

	private Timestamp createTime;

	private String content;

	private Timestamp reportedDate;

	private String renovationYear;

	private UserVO supervisor;

	private Short svUserStatus;

	private Short repairResult;
	
	private Short upgradeSource;

	public FeedbackGuaranteeVO() {
		super();

	}

	public FeedbackGuaranteeVO(UserVO creater, UserVO supervisor) {
		super();
		this.creater = creater;
		this.supervisor = supervisor;
	}

	public Long getFgid() {
		return fgid;
	}

	public void setFgid(Long fgid) {
		this.fgid = fgid;
	}

	public Long getFid() {
		return fid;
	}

	public void setFid(Long fid) {
		this.fid = fid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Short getSource() {
		return source;
	}

	public void setSource(Short source) {
		this.source = source;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public Short getCutomerType() {
		return cutomerType;
	}

	public void setCutomerType(Short cutomerType) {
		this.cutomerType = cutomerType;
	}

	public String getDeptType() {
		return deptType;
	}

	public void setDeptType(String deptType) {
		this.deptType = deptType;
	}

	public String getWorkType() {
		return workType;
	}

	public void setWorkType(String workType) {
		this.workType = workType;
	}

	public String getBids() {
		return bids;
	}

	public void setBids(String bids) {
		this.bids = bids;
	}

	public String getBrands() {
		return brands;
	}

	public void setBrands(String brands) {
		this.brands = brands;
	}

	public UserVO getCreater() {
		return creater;
	}

	public void setCreater(UserVO creater) {
		this.creater = creater;
	}

	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getReportedDate() {
		return reportedDate;
	}

	public void setReportedDate(Timestamp reportedDate) {
		this.reportedDate = reportedDate;
	}

	public String getRenovationYear() {
		return renovationYear;
	}

	public void setRenovationYear(String renovationYear) {
		this.renovationYear = renovationYear;
	}

	public UserVO getSupervisor() {
		return supervisor;
	}

	public void setSupervisor(UserVO supervisor) {
		this.supervisor = supervisor;
	}

	public Short getSvUserStatus() {
		return svUserStatus;
	}

	public void setSvUserStatus(Short svUserStatus) {
		this.svUserStatus = svUserStatus;
	}

	public Short getRepairResult() {
		return repairResult;
	}

	public void setRepairResult(Short repairResult) {
		this.repairResult = repairResult;
	}

	public Short getUpgradeSource() {
		return upgradeSource;
	}

	public void setUpgradeSource(Short upgradeSource) {
		this.upgradeSource = upgradeSource;
	}

	
}
