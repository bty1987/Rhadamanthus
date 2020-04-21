package com.fanglin.inventory.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.communion.vo.HouseVO;
import com.fanglin.personel.vo.UserBaseVO;

public class AccessoriesVO implements Serializable {

	private static final long serialVersionUID = -867433293177361277L;

	private Long aid;

	private String no;

	private String orderId;

	private Long csid;

	private HouseVO house;

	private UserBaseVO supervisor;

	private UserBaseVO creater;

	private UserBaseVO approver;

	private Timestamp createTime;

	private Timestamp approverTime;

	private Timestamp fetchTime;

	private Short schedule;

	private Short status;
	
	private Long total;
	
	private Integer printnum;
	
	private String comment;
	
	private UserBaseVO deliver;
	
	private Timestamp deliverTime;
	
	public AccessoriesVO() {
		super();
	}

	public AccessoriesVO(UserBaseVO creater) {
		super();
		this.creater = creater;
	}

	public AccessoriesVO(HouseVO house, UserBaseVO creater, UserBaseVO approver, UserBaseVO supervisor, UserBaseVO deliver) {
		super();
		this.house = house;
		this.creater = creater;
		this.approver = approver;
		this.supervisor = supervisor;
		this.deliver = deliver;
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

	public Long getCsid() {
		return csid;
	}

	public void setCsid(Long csid) {
		this.csid = csid;
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

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
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

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
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

	public Timestamp getFetchTime() {
		return fetchTime;
	}

	public void setFetchTime(Timestamp fetchTime) {
		this.fetchTime = fetchTime;
	}

	public Short getSchedule() {
		return schedule;
	}

	public void setSchedule(Short schedule) {
		this.schedule = schedule;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Long getTotal() {
		return total;
	}

	public void setTotal(Long total) {
		this.total = total;
	}

	public Integer getPrintnum() {
		return printnum;
	}

	public void setPrintnum(Integer printnum) {
		this.printnum = printnum;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public UserBaseVO getDeliver() {
		return deliver;
	}

	public void setDeliver(UserBaseVO deliver) {
		this.deliver = deliver;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getDeliverTime() {
		return deliverTime;
	}

	public void setDeliverTime(Timestamp deliverTime) {
		this.deliverTime = deliverTime;
	}

}
