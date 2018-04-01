package com.fanglin.communion.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserVO;

public class DataDrawingVO implements Serializable {

	private static final long serialVersionUID = -6898607045254004913L;

	private Long ddid;
	
	private Long sid;
	
	private String name;
	
	private String drawingUrl;
	
	private Short drawingType;
	
	private Short type;
	
	private UserVO creater;
	
	private Timestamp createTime;
	
	private Short status;

	public DataDrawingVO() {
		super();
	}

	public DataDrawingVO(UserVO creater) {
		super();
		this.creater = creater;
	}

	public Long getDdid() {
		return ddid;
	}

	public void setDdid(Long ddid) {
		this.ddid = ddid;
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

	public UserVO getCreater() {
		return creater;
	}

	public void setCreater(UserVO creater) {
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
