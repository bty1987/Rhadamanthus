package com.fanglin.decoration.vo;

import java.io.Serializable;
import java.sql.Timestamp;
import org.apache.struts2.json.annotations.JSON;
import com.fanglin.personel.vo.UserBaseVO;

public class DecorationMeasureVO implements Serializable {

	private static final long serialVersionUID = -2963707929983696192L;

	private Long dmid;
	
	private DecorationVO decoration;

	private Timestamp applayTime;

	private String content;

	private Long actualTime;

	private Timestamp startTime;

	private Timestamp endTime;

	private Short status;

	private Short count;
	
	private UserBaseVO appler;
	
	private UserBaseVO measurer;

	private Integer company;
	
	public DecorationMeasureVO() {
		super();
	}

	public DecorationMeasureVO(DecorationVO decoration,UserBaseVO appler,UserBaseVO measurer) {
		super();
		this.decoration = decoration;
		this.appler = appler;
		this.measurer = measurer;
	}

	public Long getDmid() {
		return dmid;
	}

	public void setDmid(Long dmid) {
		this.dmid = dmid;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getApplayTime() {
		return applayTime;
	}

	public void setApplayTime(Timestamp applayTime) {
		this.applayTime = applayTime;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Long getActualTime() {
		return actualTime;
	}

	public void setActualTime(Long actualTime) {
		this.actualTime = actualTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getStartTime() {
		return startTime;
	}

	public void setStartTime(Timestamp startTime) {
		this.startTime = startTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
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

	public Short getCount() {
		return count;
	}

	public void setCount(Short count) {
		this.count = count;
	}

	public UserBaseVO getAppler() {
		return appler;
	}

	public void setAppler(UserBaseVO appler) {
		this.appler = appler;
	}

	public UserBaseVO getMeasurer() {
		return measurer;
	}

	public void setMeasurer(UserBaseVO measurer) {
		this.measurer = measurer;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

}
