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
@Table(name="building", catalog = "building")
public class BuildingPO implements Serializable{

	private static final long serialVersionUID = -4319485351492418004L;
	
	public static final String COLUMN_BID_STR = "bid";
	
	public static final String COLUMN_NO_STR = "no";
	
	public static final String COLUMN_HSID_STR = "houseSource.hsid";
	
	public static final String COLUMN_CSID_STR = "customerSource.csid";
	
	public static final short STATUS_SIGN_SHORT  = 0;
	
	public static final short STATUS_DISABLE_SHORT  = 1;
	
	private long bid;
	
	private String no;
	
	private HouseSourcePO  houseSource;
	
	private CustomerSourcePO customerSource;
	
	private CustomerPO houseSourceAgent;
	
	private CustomerPO customerSourceAgent;
	
	private UserPO creater;
	
	private Timestamp createTime;
	
	private Timestamp signingTime;
	
	private float tradePrice;
	
	private float downpayment;
	
	private float loanPrice;
	
	private short payType;
	
	private short status;
	
	private BuildingNodePO buildingNode;
	
	private short balanceStatus;
	
	public BuildingPO() {
		super();
	}
	
	public BuildingPO(HouseSourcePO houseSource, CustomerSourcePO customerSource, CustomerPO houseSourceAgent, CustomerPO customerSourceAgent, UserPO creater, BuildingNodePO buildingNode) {
		super();
		this.houseSource = houseSource;
		this.customerSource = customerSource;
		this.houseSourceAgent = houseSourceAgent;
		this.customerSourceAgent = customerSourceAgent;
		this.creater = creater;
		this.buildingNode = buildingNode;
	}
	
	@Id
	@GeneratedValue
	@Column(name="bid")
	public long getBid() {
		return bid;
	}

	public void setBid(long bid) {
		this.bid = bid;
	}

	@Column(name="no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "hsid", referencedColumnName="hsid")
	public HouseSourcePO getHouseSource() {
		return houseSource;
	}

	public void setHouseSource(HouseSourcePO houseSource) {
		this.houseSource = houseSource;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "csid", referencedColumnName="csid")
	public CustomerSourcePO getCustomerSource() {
		return customerSource;
	}

	public void setCustomerSource(CustomerSourcePO customerSource) {
		this.customerSource = customerSource;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "hacid", referencedColumnName="cid")
	public CustomerPO getHouseSourceAgent() {
		return houseSourceAgent;
	}

	public void setHouseSourceAgent(CustomerPO houseSourceAgent) {
		this.houseSourceAgent = houseSourceAgent;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cacid", referencedColumnName="cid")
	public CustomerPO getCustomerSourceAgent() {
		return customerSourceAgent;
	}

	public void setCustomerSourceAgent(CustomerPO customerSourceAgent) {
		this.customerSourceAgent = customerSourceAgent;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName="uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@Column(name="createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name="signingTime")
	public Timestamp getSigningTime() {
		return signingTime;
	}

	public void setSigningTime(Timestamp signingTime) {
		this.signingTime = signingTime;
	}

	@Column(name="tradePrice")
	public float getTradePrice() {
		return tradePrice;
	}

	public void setTradePrice(float tradePrice) {
		this.tradePrice = tradePrice;
	}

	@Column(name="downpayment")
	public float getDownpayment() {
		return downpayment;
	}

	public void setDownpayment(float downpayment) {
		this.downpayment = downpayment;
	}

	@Column(name="loanPrice")
	public float getLoanPrice() {
		return loanPrice;
	}

	public void setLoanPrice(float loanPrice) {
		this.loanPrice = loanPrice;
	}

	@Column(name="payType")
	public short getPayType() {
		return payType;
	}

	public void setPayType(short payType) {
		this.payType = payType;
	}

	@Column(name="status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "bnid", referencedColumnName="bnid")
	public BuildingNodePO getBuildingNode() {
		return buildingNode;
	}

	public void setBuildingNode(BuildingNodePO buildingNode) {
		this.buildingNode = buildingNode;
	}

	@Column(name="balanceStatus")
	public short getBalanceStatus() {
		return balanceStatus;
	}

	public void setBalanceStatus(short balanceStatus) {
		this.balanceStatus = balanceStatus;
	}
	
}
