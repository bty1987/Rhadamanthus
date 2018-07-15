package com.fanglin.building.vo;

import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class BuildingDrawingVO implements java.io.Serializable {

	private static final long serialVersionUID = -4705921179237047500L;
	
	private Long bdid;
	
	private Long sid;
	
	private String name;
	
	private String drawingUrl;
	
	private Short drawingType;
	
	private Short type;
	
	private UserBaseVO creater;
	
	private Timestamp createTime;
	
	private Short status;

	public BuildingDrawingVO(UserBaseVO creater) {
		super();
		this.creater = creater;
	}

	public BuildingDrawingVO() {
		super();
	}

	public Long getBdid() {
		return bdid;
	}

	public void setBdid(Long bdid) {
		this.bdid = bdid;
	}

	public Long getSid() {
		return sid;
	}

	public void setSid(Long sid) {
		this.sid = sid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDrawingUrl() {
		return drawingUrl;
	}

	public void setDrawingUrl(String drawingUrl) {
		this.drawingUrl = drawingUrl;
	}

	public Short getDrawingType() {
		return drawingType;
	}

	public void setDrawingType(Short drawingType) {
		this.drawingType = drawingType;
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

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
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
