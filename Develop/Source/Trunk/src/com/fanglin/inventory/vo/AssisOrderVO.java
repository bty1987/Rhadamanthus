package com.fanglin.inventory.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.data.common.vo.VillageVO;
import com.fanglin.personel.vo.UserVO;

public class AssisOrderVO implements Serializable{

	private static final long serialVersionUID = -8463165642821021875L;
	
	private Long aoid;
	
	private String no;
	
	private String orderId;
	
	private VillageVO village;
	
	private String houseNumber;
	
	private UserVO supervisor;
	
	private UserVO creater;
	
	private Timestamp createTime;
	
	private UserVO approver;
	
	private Timestamp approverTime;
	
	private String fetchTime;
	
	private Short status;
	
	private Integer company;
	
	
	public AssisOrderVO() {
		super();
	}

	public AssisOrderVO(UserVO creater) {
		super();
		this.creater = creater;
	}

	public AssisOrderVO(VillageVO village, UserVO supervisor, UserVO creater,
			UserVO approver) {
		super();
		this.village = village;
		this.supervisor = supervisor;
		this.creater = creater;
		this.approver = approver;
	}

	public Long getAoid() {
		return aoid;
	}

	public void setAoid(Long aoid) {
		this.aoid = aoid;
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
	
	public VillageVO getVillage() {
		return village;
	}

	public void setVillage(VillageVO village) {
		this.village = village;
	}

	public String getHouseNumber() {
		return houseNumber;
	}

	public void setHouseNumber(String houseNumber) {
		this.houseNumber = houseNumber;
	}

	public UserVO getSupervisor() {
		return supervisor;
	}

	public void setSupervisor(UserVO supervisor) {
		this.supervisor = supervisor;
	}

	public UserVO getCreater() {
		return creater;
	}

	public void setCreater(UserVO creater) {
		this.creater = creater;
	}
	
	@JSON(format="yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public UserVO getApprover() {
		return approver;
	}

	public void setApprover(UserVO approver) {
		this.approver = approver;
	}
	
	@JSON(format="yyyy-MM-dd")
	public Timestamp getApproverTime() {
		return approverTime;
	}

	public void setApproverTime(Timestamp approverTime) {
		this.approverTime = approverTime;
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

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

}
