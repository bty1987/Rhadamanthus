package com.fanglin.building.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.personel.vo.UserBaseVO;

public class BuildingVO implements Serializable {

	private static final long serialVersionUID = -4319485351492418005L;

	private Long bid;

	private String no;

	private BuildingHouseVO buildingHouse;

	private BuildingCustomerVO buildingCustomer;

	private CustomerVO buildingHouseAgent;

	private CustomerVO buildingCustomerAgent;

	private UserBaseVO creater;

	private Timestamp createTime;

	private Timestamp signingTime;

	private Long tradePrice;

	private Long downpayment;

	private Long loanPrice;

	private Short payType;

	private Short status;

	private BuildingNodeVO buildingNode;

	private Short balanceStatus;

	public BuildingVO() {
		super();
	}

	public BuildingVO(BuildingHouseVO buildingHouse, BuildingCustomerVO buildingCustomer, CustomerVO buildingHouseAgent, CustomerVO buildingCustomerAgent, UserBaseVO creater, BuildingNodeVO buildingNode) {

		super();

		this.buildingHouse = buildingHouse;
		this.buildingCustomer = buildingCustomer;
		this.buildingHouseAgent = buildingHouseAgent;
		this.buildingCustomerAgent = buildingCustomerAgent;
		this.creater = creater;
		this.buildingNode = buildingNode;
	}

	public Long getBid() {
		return bid;
	}

	public void setBid(Long bid) {
		this.bid = bid;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public BuildingHouseVO getBuildingHouse() {
		return buildingHouse;
	}

	public void setBuildingHouse(BuildingHouseVO buildingHouse) {
		this.buildingHouse = buildingHouse;
	}

	public BuildingCustomerVO getBuildingCustomer() {
		return buildingCustomer;
	}

	public void setBuildingCustomer(BuildingCustomerVO buildingCustomer) {
		this.buildingCustomer = buildingCustomer;
	}

	public CustomerVO getBuildingHouseAgent() {
		return buildingHouseAgent;
	}

	public void setBuildingHouseAgent(CustomerVO buildingHouseAgent) {
		this.buildingHouseAgent = buildingHouseAgent;
	}

	public CustomerVO getBuildingCustomerAgent() {
		return buildingCustomerAgent;
	}

	public void setBuildingCustomerAgent(CustomerVO buildingCustomerAgent) {
		this.buildingCustomerAgent = buildingCustomerAgent;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getSigningTime() {
		return signingTime;
	}

	public void setSigningTime(Timestamp signingTime) {
		this.signingTime = signingTime;
	}

	public Long getTradePrice() {
		return tradePrice;
	}

	public void setTradePrice(Long tradePrice) {
		this.tradePrice = tradePrice;
	}

	public Long getDownpayment() {
		return downpayment;
	}

	public void setDownpayment(Long downpayment) {
		this.downpayment = downpayment;
	}

	public Long getLoanPrice() {
		return loanPrice;
	}

	public void setLoanPrice(Long loanPrice) {
		this.loanPrice = loanPrice;
	}

	public Short getPayType() {
		return payType;
	}

	public void setPayType(Short payType) {
		this.payType = payType;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public BuildingNodeVO getBuildingNode() {
		return buildingNode;
	}

	public void setBuildingNode(BuildingNodeVO buildingNode) {
		this.buildingNode = buildingNode;
	}

	public Short getBalanceStatus() {
		return balanceStatus;
	}

	public void setBalanceStatus(Short balanceStatus) {
		this.balanceStatus = balanceStatus;
	}

}
