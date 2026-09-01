package com.fanglin.camera.vo;

import java.io.Serializable;

public class ConstructionCameraLiveVO implements Serializable {

	private static final long serialVersionUID = 260453506297357999L;

	private Long cameraId;

	private String url;

	private String protocol;

	private String expireTime;

	public Long getCameraId() {
		return cameraId;
	}

	public void setCameraId(Long cameraId) {
		this.cameraId = cameraId;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getProtocol() {
		return protocol;
	}

	public void setProtocol(String protocol) {
		this.protocol = protocol;
	}

	public String getExpireTime() {
		return expireTime;
	}

	public void setExpireTime(String expireTime) {
		this.expireTime = expireTime;
	}

}
