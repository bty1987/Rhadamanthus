package com.fanglin.information.vo;

import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.personel.vo.UserVO;

public class EventsVO implements java.io.Serializable {

	private static final long serialVersionUID = -5649016541644991485L;

	private Long eid;

	private String orderId;

	private String title;

	private String content;

	private UserVO creater;

	private UserVO holder;

	private DepartmentVO department;

	private DepartmentVO region;

	private Short type;

	private Short atttype;

	private Timestamp createTime;

	private Integer showDate;

	private Integer beginDate;

	private Integer endDate;

	private Short isSend;

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

	public Short getAtttype() {
		return atttype;
	}

	public void setAtttype(Short atttype) {
		this.atttype = atttype;
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

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Integer getShowDate() {
		return showDate;
	}

	public void setShowDate(Integer showDate) {
		this.showDate = showDate;
	}

	public Integer getBeginDate() {
		return beginDate;
	}

	public void setBeginDate(Integer beginDate) {
		this.beginDate = beginDate;
	}

	public Integer getEndDate() {
		return endDate;
	}

	public void setEndDate(Integer endDate) {
		this.endDate = endDate;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Short getIsSend() {
		return isSend;
	}

	public void setIsSend(Short isSend) {
		this.isSend = isSend;
	}

}