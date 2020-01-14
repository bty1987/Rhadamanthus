package com.fanglin.data.common.vo;

import java.io.Serializable;

public class TaskVO implements Serializable{

	private static final long serialVersionUID = 2137362794687628843L;
	
	private Long tid;
	
	private String name;
	
	private String filepath;
	
	private Short type;
	
	private String plugins;
	
	private String keyWord;
	
	private Long handle;
	
	private Short status;
	
	private Short isShow;

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
	
	public Long getHandle() {
		return handle;
	}

	public void setHandle(Long handle) {
		this.handle = handle;
	}

	public Short getStatus() {
		return status;
	}
	
	public void setStatus(Short status) {
		this.status = status;
	}

	public Short getIsShow() {
		return isShow;
	}

	public void setIsShow(Short isShow) {
		this.isShow = isShow;
	}

	public String getKeyWord() {
		return keyWord;
	}

	public void setKeyWord(String keyWord) {
		this.keyWord = keyWord;
	}

	public String getPlugins() {
		return plugins;
	}

	public void setPlugins(String plugins) {
		this.plugins = plugins;
	}
	
}
