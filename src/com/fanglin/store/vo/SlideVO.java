package com.fanglin.store.vo;

import java.io.Serializable;

public class SlideVO implements Serializable {

	private static final long serialVersionUID = 2105684459060449547L;

	private Long sid;

	private Long gid;

	private String img;

	private String url;

	private Short status;

	public SlideVO() {
		super();
	}

	public Long getSid() {
		return sid;
	}

	public void setSid(Long sid) {
		this.sid = sid;
	}

	public Long getGid() {
		return gid;
	}

	public void setGid(Long gid) {
		this.gid = gid;
	}

	public String getImg() {
		return img;
	}

	public void setImg(String img) {
		this.img = img;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}
}
