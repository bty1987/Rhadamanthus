package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class RepairVO implements Serializable {

	private static final long serialVersionUID = 6712539681708393747L;

	private Long rid;

	private Long aid;

	private Long cnid;

	private UserBaseVO creater;

	private UserBaseVO updater;

	private Timestamp createTime;

	private Timestamp updateTime;

	private Timestamp finishTime;

	private UserBaseVO deliver;

	private UserBaseVO repaier;

	private Short status;

	private String content;
	
	private Short schedule;

	public RepairVO() {
		super();
	}

	public RepairVO(UserBaseVO creater, UserBaseVO updater, UserBaseVO deliver, UserBaseVO repaier) {
		super();
		this.creater = creater;
		this.updater = updater;
		this.deliver = deliver;
		this.repaier = repaier;
	}

	public Long getRid() {
		return rid;
	}

	public void setRid(Long rid) {
		this.rid = rid;
	}

	public Long getAid() {
		return aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
	}

	public Long getCnid() {
		return cnid;
	}

	public void setCnid(Long cnid) {
		this.cnid = cnid;
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

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Timestamp updateTime) {
		this.updateTime = updateTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}

	public UserBaseVO getDeliver() {
		return deliver;
	}

	public void setDeliver(UserBaseVO deliver) {
		this.deliver = deliver;
	}

	public UserBaseVO getRepaier() {
		return repaier;
	}

	public void setRepaier(UserBaseVO repaier) {
		this.repaier = repaier;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Short getSchedule() {
		return schedule;
	}

	public void setSchedule(Short schedule) {
		this.schedule = schedule;
	}

}
