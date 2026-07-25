package com.fanglin.market.vo;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.customer.vo.CustomerChanceVO;
import com.fanglin.customer.vo.CustomerSourceVO;

public class MarketInboundVO implements Serializable {

	private static final long serialVersionUID = -3408600511421052258L;

	private Long miid;

	private String inboundNo;

	private String name;

	private String phone;

	private String phoneHash;

	private String wechat;

	private String email;

	private String companyName;

	private String demand;

	private Long cityId;

	private Long channelId;

	private Long sourceId;

	private Long campaignId;

	private Long csid;

	private Long ccid;

	private String orderId;

	private String idempotentKey;

	private Short status;

	private String errorMsg;

	private Timestamp createTime;

	private Timestamp updateTime;

	private Integer company;

	private List<MarketInboundItemVO> items;

	private CustomerSourceVO customerSource;

	private CustomerChanceVO customerChance;

	public Long getMiid() {
		return miid;
	}

	public void setMiid(Long miid) {
		this.miid = miid;
	}

	public String getInboundNo() {
		return inboundNo;
	}

	public void setInboundNo(String inboundNo) {
		this.inboundNo = inboundNo;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getPhoneHash() {
		return phoneHash;
	}

	public void setPhoneHash(String phoneHash) {
		this.phoneHash = phoneHash;
	}

	public String getWechat() {
		return wechat;
	}

	public void setWechat(String wechat) {
		this.wechat = wechat;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public String getDemand() {
		return demand;
	}

	public void setDemand(String demand) {
		this.demand = demand;
	}

	public Long getCityId() {
		return cityId;
	}

	public void setCityId(Long cityId) {
		this.cityId = cityId;
	}

	public Long getChannelId() {
		return channelId;
	}

	public void setChannelId(Long channelId) {
		this.channelId = channelId;
	}

	public Long getSourceId() {
		return sourceId;
	}

	public void setSourceId(Long sourceId) {
		this.sourceId = sourceId;
	}

	public Long getCampaignId() {
		return campaignId;
	}

	public void setCampaignId(Long campaignId) {
		this.campaignId = campaignId;
	}

	public Long getCsid() {
		return csid;
	}

	public void setCsid(Long csid) {
		this.csid = csid;
	}

	public Long getCcid() {
		return ccid;
	}

	public void setCcid(Long ccid) {
		this.ccid = ccid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getIdempotentKey() {
		return idempotentKey;
	}

	public void setIdempotentKey(String idempotentKey) {
		this.idempotentKey = idempotentKey;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public String getErrorMsg() {
		return errorMsg;
	}

	public void setErrorMsg(String errorMsg) {
		this.errorMsg = errorMsg;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Timestamp updateTime) {
		this.updateTime = updateTime;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public List<MarketInboundItemVO> getItems() {
		return items;
	}

	public void setItems(List<MarketInboundItemVO> items) {
		this.items = items;
	}

	public CustomerSourceVO getCustomerSource() {
		return customerSource;
	}

	public void setCustomerSource(CustomerSourceVO customerSource) {
		this.customerSource = customerSource;
	}

	public CustomerChanceVO getCustomerChance() {
		return customerChance;
	}

	public void setCustomerChance(CustomerChanceVO customerChance) {
		this.customerChance = customerChance;
	}

}
