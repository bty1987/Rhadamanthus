package com.fanglin.camera.vo;

import java.io.Serializable;
import java.sql.Timestamp;

public class ConstructionCameraMediaVO implements Serializable {

	private static final long serialVersionUID = 2592517404828883567L;

	private Long ccmid;

	private String orderId;

	private Long constructionId;

	private Long cameraId;

	private Long csid;

	private Long cnid;

	private Short mediaType;

	private Short source;

	private String originUrl;

	private String mediaUrl;

	private String coverUrl;

	private Timestamp captureTime;

	private Short visible;

	private Short status;

	private Integer company;

	private Timestamp createTime;

	private String caption;

	public Long getCcmid() {
		return ccmid;
	}

	public void setCcmid(Long ccmid) {
		this.ccmid = ccmid;
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

	public Long getCameraId() {
		return cameraId;
	}

	public void setCameraId(Long cameraId) {
		this.cameraId = cameraId;
	}

	public Long getCsid() {
		return csid;
	}

	public void setCsid(Long csid) {
		this.csid = csid;
	}

	public Long getCnid() {
		return cnid;
	}

	public void setCnid(Long cnid) {
		this.cnid = cnid;
	}

	public Short getMediaType() {
		return mediaType;
	}

	public void setMediaType(Short mediaType) {
		this.mediaType = mediaType;
	}

	public Short getSource() {
		return source;
	}

	public void setSource(Short source) {
		this.source = source;
	}

	public String getOriginUrl() {
		return originUrl;
	}

	public void setOriginUrl(String originUrl) {
		this.originUrl = originUrl;
	}

	public String getMediaUrl() {
		return mediaUrl;
	}

	public void setMediaUrl(String mediaUrl) {
		this.mediaUrl = mediaUrl;
	}

	public String getCoverUrl() {
		return coverUrl;
	}

	public void setCoverUrl(String coverUrl) {
		this.coverUrl = coverUrl;
	}

	public Timestamp getCaptureTime() {
		return captureTime;
	}

	public void setCaptureTime(Timestamp captureTime) {
		this.captureTime = captureTime;
	}

	public Short getVisible() {
		return visible;
	}

	public void setVisible(Short visible) {
		this.visible = visible;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
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

	public String getCaption() {
		return caption;
	}

	public void setCaption(String caption) {
		this.caption = caption;
	}

}
