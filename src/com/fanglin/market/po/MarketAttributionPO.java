package com.fanglin.market.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "market_attribution", catalog = "market")
public class MarketAttributionPO implements Serializable {

	private static final long serialVersionUID = 3276832757577506652L;

	public static final short EVENT_SUBMIT_INT = 0;

	public static final short EVENT_CUSTOMER_SOURCE_INT = 1;

	public static final short EVENT_CUSTOMER_CHANCE_INT = 2;

	public static final short EVENT_ORDER_INT = 3;

	private long maid;

	private long campaignId;

	private long sourceId;

	private long miid;

	private long csid;

	private long ccid;

	private String orderId;

	private short eventType;

	private short status;

	private Timestamp createTime;

	private int company;

	@Id
	@GeneratedValue
	@Column(name = "maid")
	public long getMaid() {
		return maid;
	}

	public void setMaid(long maid) {
		this.maid = maid;
	}

	@Column(name = "campaignId")
	public long getCampaignId() {
		return campaignId;
	}

	public void setCampaignId(long campaignId) {
		this.campaignId = campaignId;
	}

	@Column(name = "sourceId")
	public long getSourceId() {
		return sourceId;
	}

	public void setSourceId(long sourceId) {
		this.sourceId = sourceId;
	}

	@Column(name = "miid")
	public long getMiid() {
		return miid;
	}

	public void setMiid(long miid) {
		this.miid = miid;
	}

	@Column(name = "csid")
	public long getCsid() {
		return csid;
	}

	public void setCsid(long csid) {
		this.csid = csid;
	}

	@Column(name = "ccid")
	public long getCcid() {
		return ccid;
	}

	public void setCcid(long ccid) {
		this.ccid = ccid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "eventType")
	public short getEventType() {
		return eventType;
	}

	public void setEventType(short eventType) {
		this.eventType = eventType;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
