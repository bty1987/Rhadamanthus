package com.fanglin.salary.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserVO;

public class SalaryDrawingVO implements Serializable {
	
	private static final long serialVersionUID = 4578938237466779278L;

	private long sdid;
	
	private long sid;
	
	private String name;
	
	private String drawingUrl;
	
	private short drawingType;
	
	private short type;
	
	private Object creater;
	
	private Timestamp createTime;
	
	public SalaryDrawingVO() {
		super();
	}
	
	public SalaryDrawingVO(UserVO creater) {
		super();
		this.creater = creater;
	}
	public long getSdid() {
		return sdid;
	}

	public void setSdid(long sdid) {
		this.sdid = sdid;
	}

	public long getSid() {
		return sid;
	}

	public void setSid(long sid) {
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

	public short getDrawingType() {
		return drawingType;
	}

	public void setDrawingType(short drawingType) {
		this.drawingType = drawingType;
	}

	public short getType() {
		return type;
	}

	public void setType(short type) {
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

	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	private short status;

}
