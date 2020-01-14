package com.fanglin.production.vo;

import java.io.Serializable;

public class HardwareItemVO implements Serializable{

	private static final long serialVersionUID = -2525116286170974069L;

	private Long hiid;
	
	private Long hid;
	
	private String name;
	
	private Integer num;
	
	private Integer unitprice;
	
	private String measurementunit;
	
	private String comment;
	
	private Long total;
	
	public HardwareItemVO() {
		super();
	}

	public Long getHiid() {
		return hiid;
	}

	public void setHiid(Long hiid) {
		this.hiid = hiid;
	}

	public Long getHid() {
		return hid;
	}

	public void setHid(Long hid) {
		this.hid = hid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getNum() {
		return num;
	}

	public void setNum(Integer num) {
		this.num = num;
	}

	public Integer getUnitprice() {
		return unitprice;
	}

	public void setUnitprice(Integer unitprice) {
		this.unitprice = unitprice;
	}

	public String getMeasurementunit() {
		return measurementunit;
	}

	public void setMeasurementunit(String measurementunit) {
		this.measurementunit = measurementunit;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Long getTotal() {
		return total;
	}

	public void setTotal(Long total) {
		this.total = total;
	}
	
}
