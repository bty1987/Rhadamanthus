package com.fanglin.inventory.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.personel.vo.UserVO;


public class OccessoriesVO implements Serializable {

	private static final long serialVersionUID = 6149863865123365606L;

	private Long oid;
	
	private String no;
	
	private String orderId;
	
	private UserBaseVO creater;
	
	private UserBaseVO supervisor;
	
	private UserVO supplier;
	
	private Timestamp createTime;
	
	private Short status;
	
	private Integer company;
	
	private UserBaseVO confirmer;// 确认人

	private UserBaseVO balancer;// 结算人
	
	public OccessoriesVO(){
		super();
	}

	public OccessoriesVO(UserBaseVO creater, UserBaseVO supervisor, UserBaseVO confirmer, UserBaseVO balancer) {
		super();
		this.creater = creater;
		this.supervisor = supervisor;
		this.confirmer = confirmer;
		this.balancer = balancer;
	}

	public Long getOid() {
		return oid;
	}

	public void setOid(Long oid) {
		this.oid = oid;
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

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	public UserBaseVO getSupervisor() {
		return supervisor;
	}

	public void setSupervisor(UserBaseVO supervisor) {
		this.supervisor = supervisor;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
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

	
	public UserVO getSupplier() {
		return supplier;
	}

	public void setSupplier(UserVO supplier) {
		this.supplier = supplier;
	}
	
	public UserBaseVO getConfirmer() {
		return confirmer;
	}

	public void setConfirmer(UserBaseVO confirmer) {
		this.confirmer = confirmer;
	}

	public UserBaseVO getBalancer() {
		return balancer;
	}

	public void setBalancer(UserBaseVO balancer) {
		this.balancer = balancer;
	}

}
