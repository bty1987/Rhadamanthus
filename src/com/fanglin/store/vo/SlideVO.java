package com.fanglin.store.vo;

import java.io.Serializable;

public class SlideVO implements Serializable {

	private static final long serialVersionUID = 2105684459060449547L;

	private Long sid;
	
	private MgoodsVO mgoods;
	
	private String img;
	
	private String url;
	
	private Short status;

	public SlideVO() {
		super();
	}

	public SlideVO(MgoodsVO mgoods) {
		super();
		this.mgoods = mgoods;
	}

	public Long getSid() {
		return sid;
	}

	public void setSid(Long sid) {
		this.sid = sid;
	}

	public MgoodsVO getMgoods() {
		return mgoods;
	}

	public void setMgoods(MgoodsVO mgoods) {
		this.mgoods = mgoods;
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
