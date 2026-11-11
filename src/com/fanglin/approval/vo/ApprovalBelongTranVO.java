/**
 * @File Name		: ApprovalBelongTranVO.java
 * @Package   	: com.fanglin.approval.vo
 * @Version		: 1.0
 * @Date			: 2026-11-11
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 离职移交审批主VO(一人一组)
 */

package com.fanglin.approval.vo;

import java.sql.Timestamp;

public class ApprovalBelongTranVO implements java.io.Serializable {

	private static final long serialVersionUID = 5416380912276503918L;

	private Integer abtId;

	private Long aid;

	private String userId; // 原移交人userId

	private Short tranType; // 0设计 1业务 2两者

	private String reason;

	private Long ccid;

	private Integer company;

	private Timestamp createTime;

	// 详情展示装配字段
	private String userName; // 原移交人姓名

	private String deptName; // 原移交人部门

	public Integer getAbtId() {
		return abtId;
	}

	public void setAbtId(Integer abtId) {
		this.abtId = abtId;
	}

	public Long getAid() {
		return aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public Short getTranType() {
		return tranType;
	}

	public void setTranType(Short tranType) {
		this.tranType = tranType;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	public Long getCcid() {
		return ccid;
	}

	public void setCcid(Long ccid) {
		this.ccid = ccid;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
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

}
