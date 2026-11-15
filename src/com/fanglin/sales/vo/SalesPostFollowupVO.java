package com.fanglin.sales.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import com.fanglin.personel.vo.UserBaseVO;

public class SalesPostFollowupVO implements Serializable {

	private static final long serialVersionUID = 9037612850437296147L;

	private Long sfid;

	private Long sid;

	private String orderId;

	private Short item;

	private Short way;

	private String content;

	private String result;

	private String plan;

	private Timestamp planTime;

	private UserBaseVO creater;

	private Timestamp createTime;

	private Long total;

	private Timestamp lastTime;

	private Long overdueCount;

	public SalesPostFollowupVO() {
		super();
	}

	public SalesPostFollowupVO(UserBaseVO creater) {
		super();
		this.creater = creater;
	}

	public Long getSfid() {
		return sfid;
	}

	public void setSfid(Long sfid) {
		this.sfid = sfid;
	}

	public Long getSid() {
		return sid;
	}

	public void setSid(Long sid) {
		this.sid = sid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Short getItem() {
		return item;
	}

	public void setItem(Short item) {
		this.item = item;
	}

	public Short getWay() {
		return way;
	}

	public void setWay(Short way) {
		this.way = way;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getResult() {
		return result;
	}

	public void setResult(String result) {
		this.result = result;
	}

	public String getPlan() {
		return plan;
	}

	public void setPlan(String plan) {
		this.plan = plan;
	}

	public Timestamp getPlanTime() {
		return planTime;
	}

	public void setPlanTime(Timestamp planTime) {
		this.planTime = planTime;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Long getTotal() {
		return total;
	}

	public void setTotal(Long total) {
		this.total = total;
	}

	public Timestamp getLastTime() {
		return lastTime;
	}

	public void setLastTime(Timestamp lastTime) {
		this.lastTime = lastTime;
	}

	public Long getOverdueCount() {
		return overdueCount;
	}

	public void setOverdueCount(Long overdueCount) {
		this.overdueCount = overdueCount;
	}

}
