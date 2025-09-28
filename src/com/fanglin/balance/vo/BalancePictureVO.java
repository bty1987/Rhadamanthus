package com.fanglin.balance.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class BalancePictureVO implements Serializable {

	private static final long serialVersionUID = -5029677985402578973L;

	private Long bpid;

	private Long bid;

	private Long pid;

	private String name;

	private String path;

	private Integer filesize;

	private Short type;

	UserBaseVO creater;

	private Timestamp createTime;

	private Short status;

	public BalancePictureVO() {
		super();
	}

	public BalancePictureVO(UserBaseVO creater) {
		super();
		this.creater = creater;
	}

	public BalancePictureVO(Long bpid, Long bid, Long pid, String name, String path, Short type, UserBaseVO creater, Timestamp createTime, Short status) {
		super();
		this.bpid = bpid;
		this.bid = bid;
		this.pid = pid;
		this.name = name;
		this.path = path;
		this.type = type;
		this.creater = creater;
		this.createTime = createTime;
		this.status = status;
	}

	public Long getBpid() {
		return bpid;
	}

	public void setBpid(Long bpid) {
		this.bpid = bpid;
	}

	public Long getBid() {
		return bid;
	}

	public void setBid(Long bid) {
		this.bid = bid;
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

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public Integer getFilesize() {
		return filesize;
	}

	public void setFilesize(Integer filesize) {
		this.filesize = filesize;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}
