package com.fanglin.inventory.vo;

import java.io.Serializable;

import com.fanglin.communion.vo.WorkTypeVO;

public class AccessoriesTypeVO implements Serializable{

	private static final long serialVersionUID = -7622284090232006941L;
	
	private Long atid;
	
	private String name;
	
	private WorkTypeVO workType;
	
	private Short status;
	
	private String comment;

	public AccessoriesTypeVO() {
		super();
	}

	public AccessoriesTypeVO(WorkTypeVO workType) {
		super();
		this.workType = workType;
	}
	
	public Long getAtid() {
		return atid;
	}

	public void setAtid(Long atid) {
		this.atid = atid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public WorkTypeVO getWorkType() {
		return workType;
	}

	public void setWorkType(WorkTypeVO workType) {
		this.workType = workType;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
	
}
