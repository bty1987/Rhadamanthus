package com.fanglin.sales.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class SalesPictureVO implements Serializable{

	private static final long serialVersionUID = -804325790993801836L;

	private Long spid;

	private Long sid;

	private Long siid;

	private String name;

	private String path;

	private Short type;

	UserBaseVO creater;

	private Timestamp createTime;

	private Short status;

	public SalesPictureVO() {
		super();
	}

	public SalesPictureVO(UserBaseVO creater) {
		super();
		this.creater = creater;
	}
	
	public SalesPictureVO(Long spid, Long sid, Long siid, String name,String path, Short type, UserBaseVO creater, Timestamp createTime,Short status) {
		super();
		this.spid = spid;
		this.sid = sid;
		this.siid = siid;
		this.name = name;
		this.path = path;
		this.type = type;
		this.creater = creater;
		this.createTime = createTime;
		this.status = status;
	}

	public Long getSpid() {
		return spid;
	}

	public void setSpid(Long spid) {
		this.spid = spid;
	}

	public Long getSid() {
		return sid;
	}

	public void setSid(Long sid) {
		this.sid = sid;
	}

	public Long getSiid() {
		return siid;
	}

	public void setSiid(Long siid) {
		this.siid = siid;
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
