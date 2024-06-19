package com.fanglin.building.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.communion.po.CustomerPO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "building", catalog = "building")
public class BuildingPO implements Serializable {

	private static final long serialVersionUID = -4319485351492418004L;

	public static final String COLUMN_BID_STR = "bid";

	public static final String COLUMN_NO_STR = "no";

	public static final String COLUMN_HSID_STR = "buildingHouse.hsid";

	public static final String COLUMN_CSID_STR = "buildingCustomer.csid";

	public static final short STATUS_SIGN_SHORT = 0;

	public static final short STATUS_DISABLE_SHORT = 1;

	private long bid;

	private String no;

	private BuildingHousePO buildingHouse;

	private BuildingCustomerPO buildingCustomer;

	private CustomerPO buildingHouseAgent;

	private CustomerPO buildingCustomerAgent;

	private UserPO creater;

	private Timestamp createTime;

	private Timestamp signingTime;

	private long tradePrice;

	private long downpayment;

	private long loanPrice;

	private short payType;

	private short status;

	private BuildingNodePO buildingNode;

	private short balanceStatus;

	public BuildingPO() {
		super();
	}

	public BuildingPO(BuildingHousePO buildingHouse, BuildingCustomerPO buildingCustomer, CustomerPO buildingHouseAgent, CustomerPO buildingCustomerAgent, UserPO creater, BuildingNodePO buildingNode) {
		super();
		this.buildingHouse = buildingHouse;
		this.buildingCustomer = buildingCustomer;
		this.buildingHouseAgent = buildingHouseAgent;
		this.buildingCustomerAgent = buildingCustomerAgent;
		this.creater = creater;
		this.buildingNode = buildingNode;
	}

	@Id
	@GeneratedValue
	@Column(name = "bid")
	public long getBid() {
		return bid;
	}

	public void setBid(long bid) {
		this.bid = bid;
	}

	@Column(name = "no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "hsid", referencedColumnName = "hsid")
	public BuildingHousePO getBuildingHouse() {
		return buildingHouse;
	}

	public void setBuildingHouse(BuildingHousePO buildingHouse) {
		this.buildingHouse = buildingHouse;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "csid", referencedColumnName = "csid")
	public BuildingCustomerPO getBuildingCustomer() {
		return buildingCustomer;
	}

	public void setBuildingCustomer(BuildingCustomerPO buildingCustomer) {
		this.buildingCustomer = buildingCustomer;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "hacid", referencedColumnName = "cid")
	public CustomerPO getBuildingHouseAgent() {
		return buildingHouseAgent;
	}

	public void setBuildingHouseAgent(CustomerPO buildingHouseAgent) {
		this.buildingHouseAgent = buildingHouseAgent;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cacid", referencedColumnName = "cid")
	public CustomerPO getBuildingCustomerAgent() {
		return buildingCustomerAgent;
	}

	public void setBuildingCustomerAgent(CustomerPO buildingCustomerAgent) {
		this.buildingCustomerAgent = buildingCustomerAgent;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "signingTime")
	public Timestamp getSigningTime() {
		return signingTime;
	}

	public void setSigningTime(Timestamp signingTime) {
		this.signingTime = signingTime;
	}

	@Column(name = "tradePrice")
	public long getTradePrice() {
		return tradePrice;
	}

	public void setTradePrice(long tradePrice) {
		this.tradePrice = tradePrice;
	}

	@Column(name = "downpayment")
	public long getDownpayment() {
		return downpayment;
	}

	public void setDownpayment(long downpayment) {
		this.downpayment = downpayment;
	}

	@Column(name = "loanPrice")
	public long getLoanPrice() {
		return loanPrice;
	}

	public void setLoanPrice(long loanPrice) {
		this.loanPrice = loanPrice;
	}

	@Column(name = "payType")
	public short getPayType() {
		return payType;
	}

	public void setPayType(short payType) {
		this.payType = payType;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "bnid", referencedColumnName = "bnid")
	public BuildingNodePO getBuildingNode() {
		return buildingNode;
	}

	public void setBuildingNode(BuildingNodePO buildingNode) {
		this.buildingNode = buildingNode;
	}

	@Column(name = "balanceStatus")
	public short getBalanceStatus() {
		return balanceStatus;
	}

	public void setBalanceStatus(short balanceStatus) {
		this.balanceStatus = balanceStatus;
	}

}
