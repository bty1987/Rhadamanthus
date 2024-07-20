/**
 * @File Name	: ReworkVo.java
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date		: 2014-9-23
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.data.common.vo.ConstructionPaceVO;

public class ConstructionPlanVO implements Serializable {

	private static final long serialVersionUID = 4826596660979940757L;

	private long cpid;

	private long cid;

	private String orderId;

	private String name;

	private ConstructionPaceVO pace;

	private Timestamp createTime;

	private Timestamp startTime;

	private Timestamp endTime;

	private String comment;

	public ConstructionPlanVO() {
		super();
	}

	public ConstructionPlanVO(ConstructionPaceVO pace) {

		super();

		this.pace = pace;
	}

	public long getCpid() {
		return cpid;
	}

	public void setCpid(long cpid) {
		this.cpid = cpid;
	}

	public long getCid() {
		return cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public ConstructionPaceVO getPace() {
		return pace;
	}

	public void setPace(ConstructionPaceVO pace) {
		this.pace = pace;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
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

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
