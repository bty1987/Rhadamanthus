package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.vo.UserBaseVO;

public class ComplainVO implements Serializable {

	private static final long serialVersionUID = 7978798712131121093L;

	private Long cid;
	
	private Long csid;
		
	private Short type;
	
	private DecorationVO decoration;
	
	private UserBaseVO creater;
	
	private UserBaseVO updater;
	
	private Timestamp createTime;
	
	private Timestamp updateTime;
	
	private Timestamp finishTime;
	
	private Short level;
	
	private Short status;
	
	private Short gladness;
	
	private Integer company;

	public ComplainVO() {
		super();
	}

	public ComplainVO(DecorationVO decoration,
			UserBaseVO creater, UserBaseVO updater) {
		super();
		this.decoration = decoration;
		this.creater = creater;
		this.updater = updater;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public Long getCsid() {
		return csid;
	}

	public void setCsid(Long csid) {
		this.csid = csid;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	public UserBaseVO getUpdater() {
		return updater;
	}

	public void setUpdater(UserBaseVO updater) {
		this.updater = updater;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Timestamp updateTime) {
		this.updateTime = updateTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}

	public Short getLevel() {
		return level;
	}

	public void setLevel(Short level) {
		this.level = level;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Short getGladness() {
		return gladness;
	}

	public void setGladness(Short gladness) {
		this.gladness = gladness;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

}
