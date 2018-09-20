package com.fanglin.information.vo;

import java.io.Serializable;

public class TaskVO implements Serializable{

	private static final long serialVersionUID = 2137362794687628843L;
	
	private Long tid;
	
	private String name;
	
	private String filepath;
	
	private Short type;
	
	private String content;
	
	private Short status;

	public TaskVO(){
		super();
	}
	
	public Long getTid() {
		return tid;
	}
	
	public void setTid(Long tid) {
		this.tid = tid;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public String getFilepath() {
		return filepath;
	}
	
	public void setFilepath(String filepath) {
		this.filepath = filepath;
	}
	
	public Short getType() {
		return type;
	}
	
	public void setType(Short type) {
		this.type = type;
	}
	
	public Short getStatus() {
		return status;
	}
	
	public void setStatus(Short status) {
		this.status = status;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}
	
	
}
