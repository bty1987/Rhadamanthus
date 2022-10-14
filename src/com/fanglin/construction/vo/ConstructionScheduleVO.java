/**
 * @File Name	: CleaningConstructionScheduleVO.java
 * @Package   	: com.fanglin.vo.constructionSchedule
 * @Version		: 1.0
 * @Date		: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.data.common.vo.ConstructionNodeVO;
import com.fanglin.decoration.vo.DecorationVO;

public class ConstructionScheduleVO implements Serializable {

	private static final long serialVersionUID = -8887915345535064194L;

	private Long csid;

	private ConstructionVO construction;

	private DecorationVO decoration;

	private Long cid;

	private String orderId;

	private Long cnid;

	private Timestamp startTime;

	private Timestamp endTime;

	private Short status;

	private Short checkout;

	private Short schedule;

	private ConstructionNodeVO node;

	public ConstructionScheduleVO() {
		super();
	}

	public ConstructionScheduleVO(ConstructionNodeVO node, ConstructionVO construction, DecorationVO decoration) {
		super();
		this.node = node;
		this.construction = construction;
		this.decoration = decoration;
	}

	public Long getCsid() {
		return csid;
	}

	public void setCsid(Long csid) {
		this.csid = csid;
	}

	public ConstructionVO getConstruction() {
		return construction;
	}

	public void setConstruction(ConstructionVO construction) {
		this.construction = construction;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Long getCnid() {
		return cnid;
	}

	public void setCnid(Long cnid) {
		this.cnid = cnid;
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

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Short getCheckout() {
		return checkout;
	}

	public void setCheckout(Short checkout) {
		this.checkout = checkout;
	}

	public Short getSchedule() {
		return schedule;
	}

	public void setSchedule(Short schedule) {
		this.schedule = schedule;
	}

	public ConstructionNodeVO getNode() {
		return node;
	}

	public void setNode(ConstructionNodeVO node) {
		this.node = node;
	}

}
