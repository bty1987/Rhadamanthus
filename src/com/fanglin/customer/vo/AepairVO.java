package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.vo.UserBaseVO;

public class AepairVO implements Serializable {

	private static final long serialVersionUID = -887578195510883733L;

	private Long aid;

	private Long csid;

	private DecorationVO decoration;

	private UserBaseVO creater;

	private UserBaseVO updater;

	private UserBaseVO repaier;

	private Timestamp createTime;

	private Timestamp targetTime;

	private Timestamp updateTime;

	private Timestamp finishTime;

	private Short onestate;

	private Short twostate;

	private Short thrstate;

	private Short forstate;

	private Short fivstate;

	private Short status;

	private Long outlay;

	private Long outpay;

	private Short gladness;

	private Integer company;

	private String comment;

	public AepairVO() {
		super();
	}

	public AepairVO(DecorationVO decoration, UserBaseVO creater, UserBaseVO updater, UserBaseVO repaier) {
		super();
		this.decoration = decoration;
		this.creater = creater;
		this.updater = updater;
		this.repaier = repaier;
	}

	public Long getAid() {
		return aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
	}

	public Long getCsid() {
		return csid;
	}

	public void setCsid(Long csid) {
		this.csid = csid;
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

	public UserBaseVO getRepaier() {
		return repaier;
	}

	public void setRepaier(UserBaseVO repaier) {
		this.repaier = repaier;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getTargetTime() {
		return targetTime;
	}

	public void setTargetTime(Timestamp targetTime) {
		this.targetTime = targetTime;
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

	public Short getOnestate() {
		return onestate;
	}

	public void setOnestate(Short onestate) {
		this.onestate = onestate;
	}

	public Short getTwostate() {
		return twostate;
	}

	public void setTwostate(Short twostate) {
		this.twostate = twostate;
	}

	public Short getThrstate() {
		return thrstate;
	}

	public void setThrstate(Short thrstate) {
		this.thrstate = thrstate;
	}

	public Short getForstate() {
		return forstate;
	}

	public void setForstate(Short forstate) {
		this.forstate = forstate;
	}

	public Short getFivstate() {
		return fivstate;
	}

	public void setFivstate(Short fivstate) {
		this.fivstate = fivstate;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Long getOutlay() {
		return outlay;
	}

	public void setOutlay(Long outlay) {
		this.outlay = outlay;
	}

	public Long getOutpay() {
		return outpay;
	}

	public void setOutpay(Long outpay) {
		this.outpay = outpay;
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

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
