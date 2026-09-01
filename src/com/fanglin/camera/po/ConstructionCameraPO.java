package com.fanglin.camera.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "camera", catalog = "construction")
public class ConstructionCameraPO implements Serializable {

	private static final long serialVersionUID = -6904313128321546081L;

	public static final String COLUMN_CCID_STR = "ccid";

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final String COLUMN_CONSTRUCTIONID_STR = "constructionId";

	public static final String COLUMN_PROVIDER_STR = "provider";

	public static final String COLUMN_DEVICESERIAL_STR = "deviceSerial";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_ONLINESTATUS_STR = "onlineStatus";

	public static final short STATUS_DISABLE_INT = 0;

	public static final short STATUS_ENABLE_INT = 1;

	public static final short ONLINE_UNKNOWN_INT = 0;

	public static final short ONLINE_ON_INT = 1;

	public static final short OPEN_DISABLE_INT = 0;

	public static final short OPEN_ENABLE_INT = 1;

	private long ccid;

	private String orderId;

	private long constructionId;

	private String provider;

	private String deviceSerial;

	private int channelNo;

	private String name;

	private String verifyCode;

	private short status;

	private short onlineStatus;

	private short openLive;

	private short openCapture;

	private short openPlayback;

	private short openAlbum;

	private String visibleStart;

	private String visibleEnd;

	private int company;

	private Timestamp createTime;

	private Timestamp updateTime;

	@Id
	@GeneratedValue(strategy = IDENTITY)
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

	@Column(name = "constructionId")
	public long getConstructionId() {
		return constructionId;
	}

	public void setConstructionId(long constructionId) {
		this.constructionId = constructionId;
	}

	@Column(name = "provider")
	public String getProvider() {
		return provider;
	}

	public void setProvider(String provider) {
		this.provider = provider;
	}

	@Column(name = "deviceSerial")
	public String getDeviceSerial() {
		return deviceSerial;
	}

	public void setDeviceSerial(String deviceSerial) {
		this.deviceSerial = deviceSerial;
	}

	@Column(name = "channelNo")
	public int getChannelNo() {
		return channelNo;
	}

	public void setChannelNo(int channelNo) {
		this.channelNo = channelNo;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "verifyCode")
	public String getVerifyCode() {
		return verifyCode;
	}

	public void setVerifyCode(String verifyCode) {
		this.verifyCode = verifyCode;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "onlineStatus")
	public short getOnlineStatus() {
		return onlineStatus;
	}

	public void setOnlineStatus(short onlineStatus) {
		this.onlineStatus = onlineStatus;
	}

	@Column(name = "openLive")
	public short getOpenLive() {
		return openLive;
	}

	public void setOpenLive(short openLive) {
		this.openLive = openLive;
	}

	@Column(name = "openCapture")
	public short getOpenCapture() {
		return openCapture;
	}

	public void setOpenCapture(short openCapture) {
		this.openCapture = openCapture;
	}

	@Column(name = "openPlayback")
	public short getOpenPlayback() {
		return openPlayback;
	}

	public void setOpenPlayback(short openPlayback) {
		this.openPlayback = openPlayback;
	}

	@Column(name = "openAlbum")
	public short getOpenAlbum() {
		return openAlbum;
	}

	public void setOpenAlbum(short openAlbum) {
		this.openAlbum = openAlbum;
	}

	@Column(name = "visibleStart")
	public String getVisibleStart() {
		return visibleStart;
	}

	public void setVisibleStart(String visibleStart) {
		this.visibleStart = visibleStart;
	}

	@Column(name = "visibleEnd")
	public String getVisibleEnd() {
		return visibleEnd;
	}

	public void setVisibleEnd(String visibleEnd) {
		this.visibleEnd = visibleEnd;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
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

}
