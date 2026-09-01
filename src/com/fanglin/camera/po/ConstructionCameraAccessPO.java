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
@Table(name = "cameraaccess", catalog = "construction")
public class ConstructionCameraAccessPO implements Serializable {

	private static final long serialVersionUID = -7570246433455612720L;

	public static final short VIEWER_TYPE_CUSTOMER_INT = 1;

	public static final short VIEWER_TYPE_USER_INT = 2;

	public static final short VIEWER_TYPE_SHARE_INT = 3;

	public static final short RESULT_FAIL_INT = 0;

	public static final short RESULT_SUCCESS_INT = 1;

	public static final String ACTION_LIVE_STR = "live";

	public static final String ACTION_CAPTURE_STR = "capture";

	public static final String ACTION_ALBUM_STR = "album";

	private long ccaid;

	private String orderId;

	private long cameraId;

	private short viewerType;

	private String viewerId;

	private String action;

	private short result;

	private String message;

	private String ip;

	private String userAgent;

	private Timestamp createTime;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "ccaid")
	public long getCcaid() {
		return ccaid;
	}

	public void setCcaid(long ccaid) {
		this.ccaid = ccaid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "cameraId")
	public long getCameraId() {
		return cameraId;
	}

	public void setCameraId(long cameraId) {
		this.cameraId = cameraId;
	}

	@Column(name = "viewerType")
	public short getViewerType() {
		return viewerType;
	}

	public void setViewerType(short viewerType) {
		this.viewerType = viewerType;
	}

	@Column(name = "viewerId")
	public String getViewerId() {
		return viewerId;
	}

	public void setViewerId(String viewerId) {
		this.viewerId = viewerId;
	}

	@Column(name = "action")
	public String getAction() {
		return action;
	}

	public void setAction(String action) {
		this.action = action;
	}

	@Column(name = "result")
	public short getResult() {
		return result;
	}

	public void setResult(short result) {
		this.result = result;
	}

	@Column(name = "message")
	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	@Column(name = "ip")
	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	@Column(name = "userAgent")
	public String getUserAgent() {
		return userAgent;
	}

	public void setUserAgent(String userAgent) {
		this.userAgent = userAgent;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

}
