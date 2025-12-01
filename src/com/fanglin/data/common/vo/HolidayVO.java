package com.fanglin.data.common.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class HolidayVO implements Serializable {

	private static final long serialVersionUID = -3700604739524044863L;

	private Long hdid;

	private String period;

	private Timestamp startTime;

	private Timestamp endTime;

	private Integer daynum;

	private Short atttype;

	public HolidayVO() {
		super();
	}

	public Long getHdid() {
		return hdid;
	}

	public void setHdid(Long hdid) {
		this.hdid = hdid;
	}

	public String getPeriod() {
		return period;
	}

	public void setPeriod(String period) {
		this.period = period;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getStartTime() {
		return startTime;
	}

	public void setStartTime(Timestamp startTime) {
		this.startTime = startTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getEndTime() {
		return endTime;
	}

	public void setEndTime(Timestamp endTime) {
		this.endTime = endTime;
	}

	public Integer getDaynum() {
		return daynum;
	}

	public void setDaynum(Integer daynum) {
		this.daynum = daynum;
	}

	public Short getAtttype() {
		return atttype;
	}

	public void setAtttype(Short atttype) {
		this.atttype = atttype;
	}

}
