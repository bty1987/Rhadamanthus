package com.fanglin.information.vo;

import java.sql.Timestamp;
import java.util.Date;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.department.vo.DepartmentVO;
import com.fanglin.personel.vo.UserVO;

public class EventsVO implements java.io.Serializable {

	private static final long serialVersionUID = -5649016541644991485L;

	private Long eid;
	
	private String title;
	
	private String content;
	
	private UserVO creater;
	
	private UserVO holder;
	
	private DepartmentVO department;
	
	private DepartmentVO region;
	
	private Short type;
	
	private Timestamp createTime;
	
	private Date showDate;
	
	private String beginDate;
	
	private String endDate;

	public EventsVO() {
		super();
	}

	public EventsVO(UserVO creater, UserVO holder, DepartmentVO department, DepartmentVO region) {
		super();
		this.creater = creater;
		this.holder = holder;
		this.department = department;
		this.region = region;
	}

	public Long getEid() {
		return eid;
	}

	public void setEid(Long eid) {
		this.eid = eid;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public UserVO getCreater() {
		return creater;
	}

	public void setCreater(UserVO creater) {
		this.creater = creater;
	}

	public UserVO getHolder() {
		return holder;
	}

	public void setHolder(UserVO holder) {
		this.holder = holder;
	}

	public DepartmentVO getDepartment() {
		return department;
	}

	public void setDepartment(DepartmentVO department) {
		this.department = department;
	}

	public DepartmentVO getRegion() {
		return region;
	}

	public void setRegion(DepartmentVO region) {
		this.region = region;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format="yyyy-MM-dd")
	public Date getShowDate() {
		return showDate;
	}

	public void setShowDate(Date showDate) {
		this.showDate = showDate;
	}

	public String getBeginDate() {
		return beginDate;
	}

	public void setBeginDate(String beginDate) {
		this.beginDate = beginDate;
	}

	public String getEndDate() {
		return endDate;
	}

	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}

}