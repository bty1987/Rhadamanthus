package com.fanglin.information.vo;

import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class ActivityVO implements java.io.Serializable {
	
	private static final long serialVersionUID = -8833128747186236841L;

	private Long aid;
	
	private String name;
	
	private UserBaseVO creater;
	
	private Short status;
	
	private Short type;
	
	private Short defaults;
	
	private Integer multiple;
	
	private Timestamp createTime;
	
	private Timestamp startTime;
	
	private Timestamp endTime;
	
	private String content;
	
	public ActivityVO(){
		super();
	}
	
	public ActivityVO(UserBaseVO creater){
		super();
		this.creater = creater;
	}

	public Long getAid() {
		return aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}
	
	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}
	
	public Short getDefaults() {
		return defaults;
	}

	public void setDefaults(Short defaults) {
		this.defaults = defaults;
	}

	public Integer getMultiple() {
		return multiple;
	}

	public void setMultiple(Integer multiple) {
		this.multiple = multiple;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
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

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

}