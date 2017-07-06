package com.fanglin.data.common.vo;

import java.io.Serializable;

public class DrawLineGroupVO implements Serializable {
	
	
	private static final long serialVersionUID = 7432243814812625222L;

	private Long gid ; 
	
	private String name ; 
	
	private short status;
	
	private String content ;

	public Long getGid() {
		return gid;
	}

	public void setGid(Long gid) {
		this.gid = gid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}
	
	
	
	

}
