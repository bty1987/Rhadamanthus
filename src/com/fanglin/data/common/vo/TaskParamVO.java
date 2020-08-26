package com.fanglin.data.common.vo;

import java.io.Serializable;

public class TaskParamVO implements Serializable{

	private static final long serialVersionUID = -2573958022961800709L;

	private Long tpid;
	
	private Long tid;
	
	private Long no;
	
	private String name;
	
	private String param;
	
	private String alias;
	
	private Short type;
	
	private String handle;
	
	private Short status;
	
	private Long sort;
	
	private String comment;

	public TaskParamVO() {
		super();
	}

	public Long getTpid() {
		return tpid;
	}

	public void setTpid(Long tpid) {
		this.tpid = tpid;
	}

	public Long getTid() {
		return tid;
	}

	public void setTid(Long tid) {
		this.tid = tid;
	}

	public Long getNo() {
		return no;
	}

	public void setNo(Long no) {
		this.no = no;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getParam() {
		return param;
	}

	public void setParam(String param) {
		this.param = param;
	}

	public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public String getHandle() {
		return handle;
	}

	public void setHandle(String handle) {
		this.handle = handle;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Long getSort() {
		return sort;
	}

	public void setSort(Long sort) {
		this.sort = sort;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
	
}
