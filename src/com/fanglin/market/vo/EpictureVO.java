package com.fanglin.market.vo;

import java.io.Serializable;

public class EpictureVO implements Serializable{

	private static final long serialVersionUID = -8492297918278463053L;
	
	private Long epid;
	
	private Long cid;
	
	private Short type;

	private String url;

	public Long getEpid() {
		return epid;
	}

	public void setEpid(Long epid) {
		this.epid = epid;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

}
