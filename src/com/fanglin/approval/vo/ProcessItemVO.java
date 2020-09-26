package com.fanglin.approval.vo;

import java.io.Serializable;

public class ProcessItemVO implements Serializable {

	private static final long serialVersionUID = 2872991823543892241L;
	
	private Long piid;
	
	private Long pid;
	
	private String id;
	
	private String name;
	
	private String form;
	
	private String type;
	
	private String validate;
	
	private String data;
	
	private String comment;
	
	private String sort;

	public ProcessItemVO() {
		super();
	}

	public Long getPiid() {
		return piid;
	}

	public void setPiid(Long piid) {
		this.piid = piid;
	}

	public Long getPid() {
		return pid;
	}

	public void setPid(Long pid) {
		this.pid = pid;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getForm() {
		return form;
	}

	public void setForm(String form) {
		this.form = form;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getValidate() {
		return validate;
	}

	public void setValidate(String validate) {
		this.validate = validate;
	}

	public String getData() {
		return data;
	}

	public void setData(String data) {
		this.data = data;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public String getSort() {
		return sort;
	}

	public void setSort(String sort) {
		this.sort = sort;
	}

}
