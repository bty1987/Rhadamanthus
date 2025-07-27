package com.fanglin.construction.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.decoration.vo.DecorationVO;

public class ConstructionInfoVO implements Serializable {

	private static final long serialVersionUID = -8887915345535064194L;

	private Long ciid;

	private String orderId;

	private DecorationVO decoration;

	private Integer timeLimit;

	private Long cid;

	private Short ishovel;

	private Short iskey;

	private Short isCeremony;

	private Timestamp startTime;

	private Timestamp endTime;

	private Timestamp finishTime;

	private Timestamp keyTime;

	private Timestamp drawlineTime;

	private Timestamp designTime;

	private Long actuaTime;

	private String comment;

	public ConstructionInfoVO() {
		super();
	}

	public ConstructionInfoVO(DecorationVO decoration) {

		super();

		this.decoration = decoration;
	}

	public Long getCiid() {
		return ciid;
	}

	public void setCiid(Long ciid) {
		this.ciid = ciid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public Integer getTimeLimit() {
		return timeLimit;
	}

	public void setTimeLimit(Integer timeLimit) {
		this.timeLimit = timeLimit;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public Short getIshovel() {
		return ishovel;
	}

	public void setIshovel(Short ishovel) {
		this.ishovel = ishovel;
	}

	public Short getIskey() {
		return iskey;
	}

	public void setIskey(Short iskey) {
		this.iskey = iskey;
	}

	public Short getIsCeremony() {
		return isCeremony;
	}

	public void setIsCeremony(Short isCeremony) {
		this.isCeremony = isCeremony;
	}

	public Timestamp getStartTime() {
		return startTime;
	}

	public void setStartTime(Timestamp startTime) {
		this.startTime = startTime;
	}

	public Timestamp getEndTime() {
		return endTime;
	}

	public void setEndTime(Timestamp endTime) {
		this.endTime = endTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getKeyTime() {
		return keyTime;
	}

	public void setKeyTime(Timestamp keyTime) {
		this.keyTime = keyTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getDrawlineTime() {
		return drawlineTime;
	}

	public void setDrawlineTime(Timestamp drawlineTime) {
		this.drawlineTime = drawlineTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getDesignTime() {
		return designTime;
	}

	public void setDesignTime(Timestamp designTime) {
		this.designTime = designTime;
	}

	public Long getActuaTime() {
		return actuaTime;
	}

	public void setActuaTime(Long actuaTime) {
		this.actuaTime = actuaTime;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
