package com.fanglin.approval.vo;

import java.io.Serializable;

public class ProcessReferVO implements Serializable {
	
	private static final long serialVersionUID = 378824284507233018L;
	
	private Long prid;
	
	private String id;
	
	private String name;
	
	private String type;

	public ProcessReferVO() {
		super();
	}

	public Long getPrid() {
		return prid;
	}

	public void setPrid(Long prid) {
		this.prid = prid;
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

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

}
