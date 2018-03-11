package com.fanglin.production.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.communion.vo.HouseVO;
import com.fanglin.personel.vo.UserBaseVO;


public class ProductionVO implements Serializable {
	
	private static final long serialVersionUID = 8400949857779897876L;

	private Long pid;
	
	private Long orderId;
	
	private String pno;
	
	private HouseVO house;
	
	private Float total;
	
	private UserBaseVO creater;
	
	private UserBaseVO designer;
	
	private Short status;
	
	private Timestamp createTime; 
	
	private Timestamp divideTime;
	
	private Timestamp confirmTime;
	
	private Short diliverystatus; 
	
	private Timestamp diliveryTime; 
	
	private Float timeLimit;
	
	private String spid;
	
	private Short type;
	
	private Integer company;
	
	public ProductionVO(){
		super();
	}

	public ProductionVO(HouseVO house, UserBaseVO creater, UserBaseVO designer) {
		super();
		this.house = house;
		this.creater = creater;
		this.designer = designer;
	}

	public Long getPid() {
		return pid;
	}

	public void setPid(Long pid) {
		this.pid = pid;
	}

	public Long getOrderId() {
		return orderId;
	}

	public void setOrderId(Long orderId) {
		this.orderId = orderId;
	}

	public HouseVO getHouse() {
		return house;
	}

	public void setHouse(HouseVO house) {
		this.house = house;
	}

	public Float getTotal() {
		return total;
	}

	public void setTotal(Float total) {
		this.total = total;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	public UserBaseVO getDesigner() {
		return designer;
	}

	public void setDesigner(UserBaseVO designer) {
		this.designer = designer;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getDivideTime() {
		return divideTime;
	}

	public void setDivideTime(Timestamp divideTime) {
		this.divideTime = divideTime;
	}
	
	public Short getDiliverystatus() {
		return diliverystatus;
	}

	public void setDiliverystatus(Short diliverystatus) {
		this.diliverystatus = diliverystatus;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getDiliveryTime() {
		return diliveryTime;
	}

	public void setDiliveryTime(Timestamp diliveryTime) {
		this.diliveryTime = diliveryTime;
	}

	public Float getTimeLimit() {
		return timeLimit;
	}

	public void setTimeLimit(Float timeLimit) {
		this.timeLimit = timeLimit;
	}

	public String getSpid() {
		return spid;
	}

	public void setSpid(String spid) {
		this.spid = spid;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getConfirmTime() {
		return confirmTime;
	}

	public void setConfirmTime(Timestamp confirmTime) {
		this.confirmTime = confirmTime;
	}

	public String getPno() {
		return pno;
	}

	public void setPno(String pno) {
		this.pno = pno;
	}
	
	
}
