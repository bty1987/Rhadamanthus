package com.fanglin.market.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "marketinbound", catalog = "market")
public class MarketInboundPO implements Serializable {

	private static final long serialVersionUID = -567282014549576904L;

	public static final short STATUS_PENDING_INT = 0;

	public static final short STATUS_SUCCESS_INT = 1;

	public static final short STATUS_FAILED_INT = 2;

	public static final short STATUS_RETRY_INT = 3;

	public static final short STATUS_IGNORE_INT = 4;

	private long miid;

	private String inboundNo;

	private String name;

	private String phone;

	private String phoneHash;

	private String wechat;

	private String email;

	private String companyName;

	private String demand;

	private long cityId;

	private long channelId;

	private long sourceId;

	private long campaignId;

	private long csid;

	private long ccid;

	private String orderId;

	private String idempotentKey;

	private short status;

	private String errorMsg;

	private Timestamp createTime;

	private Timestamp updateTime;

	private int company;

	@Id
	@GeneratedValue
	@Column(name = "miid")
	public long getMiid() {
		return miid;
	}

	public void setMiid(long miid) {
		this.miid = miid;
	}

	@Column(name = "inboundNo")
	public String getInboundNo() {
		return inboundNo;
	}

	public void setInboundNo(String inboundNo) {
		this.inboundNo = inboundNo;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "phone")
	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	@Column(name = "phoneHash")
	public String getPhoneHash() {
		return phoneHash;
	}

	public void setPhoneHash(String phoneHash) {
		this.phoneHash = phoneHash;
	}

	@Column(name = "wechat")
	public String getWechat() {
		return wechat;
	}

	public void setWechat(String wechat) {
		this.wechat = wechat;
	}

	@Column(name = "email")
	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	@Column(name = "companyName")
	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	@Column(name = "demand")
	public String getDemand() {
		return demand;
	}

	public void setDemand(String demand) {
		this.demand = demand;
	}

	@Column(name = "cityId")
	public long getCityId() {
		return cityId;
	}

	public void setCityId(long cityId) {
		this.cityId = cityId;
	}

	@Column(name = "channelId")
	public long getChannelId() {
		return channelId;
	}

	public void setChannelId(long channelId) {
		this.channelId = channelId;
	}

	@Column(name = "sourceId")
	public long getSourceId() {
		return sourceId;
	}

	public void setSourceId(long sourceId) {
		this.sourceId = sourceId;
	}

	@Column(name = "campaignId")
	public long getCampaignId() {
		return campaignId;
	}

	public void setCampaignId(long campaignId) {
		this.campaignId = campaignId;
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

	@Column(name = "idempotentKey")
	public String getIdempotentKey() {
		return idempotentKey;
	}

	public void setIdempotentKey(String idempotentKey) {
		this.idempotentKey = idempotentKey;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "errorMsg")
	public String getErrorMsg() {
		return errorMsg;
	}

	public void setErrorMsg(String errorMsg) {
		this.errorMsg = errorMsg;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "updateTime")
	public Timestamp getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Timestamp updateTime) {
		this.updateTime = updateTime;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
