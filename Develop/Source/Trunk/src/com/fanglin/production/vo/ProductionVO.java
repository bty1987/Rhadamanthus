package com.fanglin.production.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.data.common.vo.VillageVO;
import com.fanglin.personel.vo.UserVO;

public class ProductionVO implements Serializable {
	
	private static final long serialVersionUID = 8400949857779897876L;

	private Long pid;
	
	private Long orderId;
	
	private String pno;
	
	private VillageVO village;
	
	private String houseNumber;
	
	private Float total;
	
	private UserVO creater;
	
	private UserVO designer;
	
	private Short status;
	
	private Timestamp createTime; 
	
	private Timestamp divideTime;
	
	private Timestamp confirmTime;
	
	private Short diliverystatus; 
	
	private Timestamp diliveryTime; 
	
	private Float timeLimit;
	
	private Long spid;
	
	private Short type;
	
	private Integer company;
	
	public ProductionVO(){
		super();
	}

	public ProductionVO(VillageVO village, UserVO creater, UserVO designer) {
		super();
		this.village = village;
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

	public Float getTotal() {
		return total;
	}

	public void setTotal(Float total) {
		this.total = total;
	}

	public UserVO getCreater() {
		return creater;
	}

	public void setCreater(UserVO creater) {
		this.creater = creater;
	}

	public UserVO getDesigner() {
		return designer;
	}

	public void setDesigner(UserVO designer) {
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

	public Long getSpid() {
		return spid;
	}

	public void setSpid(Long spid) {
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
