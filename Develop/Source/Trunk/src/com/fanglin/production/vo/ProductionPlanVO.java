package com.fanglin.production.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class ProductionPlanVO implements Serializable{

	private static final long serialVersionUID = 4559894231877224250L;
	
	private Long ppid;
	
	private Long pid;
	
	private String no;
	
	private String path;
	
	private Timestamp startTime;
	
	private Timestamp endTime;
	
	private Short status;
	
	private String comment;
	
	public ProductionPlanVO() {
		super();
		// TODO Auto-generated constructor stub
	}


	public Long getPpid() {
		return ppid;
	}

	public void setPpid(Long ppid) {
		this.ppid = ppid;
	}


	public Long getPid() {
		return pid;
	}


	public void setPid(Long pid) {
		this.pid = pid;
	}


	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}
	@JSON(format="yyyy-MM-dd")
	public Timestamp getStartTime() {
		return startTime;
	}

	public void setStartTime(Timestamp startTime) {
		this.startTime = startTime;
	}
	@JSON(format="yyyy-MM-dd")
	public Timestamp getEndTime() {
		return endTime;
	}

	public void setEndTime(Timestamp endTime) {
		this.endTime = endTime;
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
