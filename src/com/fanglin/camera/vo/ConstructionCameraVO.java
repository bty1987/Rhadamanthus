package com.fanglin.camera.vo;

import java.io.Serializable;
import java.sql.Timestamp;

public class ConstructionCameraVO implements Serializable {

	private static final long serialVersionUID = 3301740353240831093L;

	private Long ccid;

	private String orderId;

	private Long constructionId;

	private String provider;

	private String deviceSerial;

	private Integer channelNo;

	private String name;

	private String verifyCode;

	private Short status;

	private Short onlineStatus;

	private Short openLive;

	private Short openCapture;

	private Short openPlayback;

	private Short openAlbum;

	private String visibleStart;

	private String visibleEnd;

	private Integer company;

	private Timestamp createTime;

	private Timestamp updateTime;

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

	public Long getConstructionId() {
		return constructionId;
	}

	public void setConstructionId(Long constructionId) {
		this.constructionId = constructionId;
	}

	public String getProvider() {
		return provider;
	}

	public void setProvider(String provider) {
		this.provider = provider;
	}

	public String getDeviceSerial() {
		return deviceSerial;
	}

	public void setDeviceSerial(String deviceSerial) {
		this.deviceSerial = deviceSerial;
	}

	public Integer getChannelNo() {
		return channelNo;
	}

	public void setChannelNo(Integer channelNo) {
		this.channelNo = channelNo;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getVerifyCode() {
		return verifyCode;
	}

	public void setVerifyCode(String verifyCode) {
		this.verifyCode = verifyCode;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Short getOnlineStatus() {
		return onlineStatus;
	}

	public void setOnlineStatus(Short onlineStatus) {
		this.onlineStatus = onlineStatus;
	}

	public Short getOpenLive() {
		return openLive;
	}

	public void setOpenLive(Short openLive) {
		this.openLive = openLive;
	}

	public Short getOpenCapture() {
		return openCapture;
	}

	public void setOpenCapture(Short openCapture) {
		this.openCapture = openCapture;
	}

	public Short getOpenPlayback() {
		return openPlayback;
	}

	public void setOpenPlayback(Short openPlayback) {
		this.openPlayback = openPlayback;
	}

	public Short getOpenAlbum() {
		return openAlbum;
	}

	public void setOpenAlbum(Short openAlbum) {
		this.openAlbum = openAlbum;
	}

	public String getVisibleStart() {
		return visibleStart;
	}

	public void setVisibleStart(String visibleStart) {
		this.visibleStart = visibleStart;
	}

	public String getVisibleEnd() {
		return visibleEnd;
	}

	public void setVisibleEnd(String visibleEnd) {
		this.visibleEnd = visibleEnd;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Timestamp getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Timestamp updateTime) {
		this.updateTime = updateTime;
	}

}
