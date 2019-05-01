package com.fanglin.inventory.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.communion.vo.HouseVO;
import com.fanglin.personel.vo.UserBaseVO;

public class AccessoriesVO implements Serializable {

	private static final long serialVersionUID = -8463165642821021875L;

	private Long aid;

	private String no;

	private String orderId;

	private HouseVO house;

	private UserBaseVO creater;

	private Timestamp createTime;

	private UserBaseVO approver;

	private Timestamp approverTime;

	private UserBaseVO supervisor;

	private String fetchTime;

	private Short status;

	public AccessoriesVO() {
		super();
	}

	public AccessoriesVO(UserBaseVO creater) {
		super();
		this.creater = creater;
	}

	public AccessoriesVO(HouseVO house, UserBaseVO creater, UserBaseVO approver, UserBaseVO supervisor) {
		super();
		this.house = house;
		this.creater = creater;
		this.approver = approver;
		this.supervisor = supervisor;
	}

	public Long getAid() {
		return aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public HouseVO getHouse() {
		return house;
	}

	public void setHouse(HouseVO house) {
		this.house = house;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public UserBaseVO getApprover() {
		return approver;
	}

	public void setApprover(UserBaseVO approver) {
		this.approver = approver;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getApproverTime() {
		return approverTime;
	}

	public void setApproverTime(Timestamp approverTime) {
		this.approverTime = approverTime;
	}

	public UserBaseVO getSupervisor() {
		return supervisor;
	}

	public void setSupervisor(UserBaseVO supervisor) {
		this.supervisor = supervisor;
	}

	public String getFetchTime() {
		return fetchTime;
	}

	public void setFetchTime(String fetchTime) {
		this.fetchTime = fetchTime;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}
