package com.fanglin.production.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;


import com.fanglin.personel.vo.UserVO;

public class ProductionPictureVO implements Serializable{

	private static final long serialVersionUID = -1014561970960194371L;
	
	private Long ppid;
	
	private Long pid;
	
	private String name;
	
	private UserVO creater;
	
	private Timestamp createTime;
	
	private String path;
	
	private Short status;
	
	private String comment;

	public ProductionPictureVO() {
		super();
	}
	
	public ProductionPictureVO(UserVO creater) {
		super();
		this.creater = creater;
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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public UserVO getCreater() {
		return creater;
	}

	public void setCreater(UserVO creater) {
		this.creater = creater;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
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
