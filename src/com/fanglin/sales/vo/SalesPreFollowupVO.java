package com.fanglin.sales.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import com.fanglin.personel.vo.UserBaseVO;

public class SalesPreFollowupVO implements Serializable {

	private static final long serialVersionUID = -4172683952167849153L;

	private Long sfid;

	private String orderId;

	private String category;

	private Long bid;

	private String brandName;

	private Short item;

	private Short way;

	private String content;

	private String plan;

	private Timestamp planTime;

	private UserBaseVO creater;

	private Timestamp createTime;

	private Long total;

	private Timestamp lastTime;

	private Long overdueCount;

	public SalesPreFollowupVO() {
		super();
	}

	public SalesPreFollowupVO(UserBaseVO creater) {
		super();
		this.creater = creater;
	}

	public Long getSfid() {
		return sfid;
	}

	public void setSfid(Long sfid) {
		this.sfid = sfid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public Long getBid() {
		return bid;
	}

	public void setBid(Long bid) {
		this.bid = bid;
	}

	public String getBrandName() {
		return brandName;
	}

	public void setBrandName(String brandName) {
		this.brandName = brandName;
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
