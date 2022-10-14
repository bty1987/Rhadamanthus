package com.fanglin.salary.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserVO;

public class SalaryDrawingVO implements Serializable {

	private static final long serialVersionUID = 4578938237466779278L;

	private Long sdid;

	private Long sid;

	private String name;

	private String drawingUrl;

	private Integer filesize;

	private Short drawingType;

	private Object creater;

	private Timestamp createTime;

	private Short status;

	private Short type;

	public SalaryDrawingVO() {
		super();
	}

	public SalaryDrawingVO(UserVO creater) {
		super();
		this.creater = creater;
	}

	public Long getSdid() {
		return sdid;
	}

	public void setSdid(Long sdid) {
		this.sdid = sdid;
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

	public Object getCreater() {
		return creater;
	}

	public void setCreater(Object creater) {
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
