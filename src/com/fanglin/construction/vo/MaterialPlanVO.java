package com.fanglin.construction.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class MaterialPlanVO implements Serializable {

	private static final long serialVersionUID = -6412539001789647357L;

	private Long mpid;

	private Long cid;

	private String orderId;

	private Long ruleId;

	private Short type;

	private Long categoryId;

	private String categoryName;

	private Long brandId;

	private String brandName;

	private Long cnid;

	private String nodeName;

	private Short action;

	private Short anchor;

	private Integer offsetDay;

	private Timestamp manualTime;

	private Short status;

	private Timestamp actualTime;

	private Long operater;

	private String comment;

	private Integer company;

	private Timestamp createTime;

	// ---- 以下为读时派生字段, 不落库 ----

	private Timestamp anchorTime; // 锚点时间(含实际空回退计划)

	private Timestamp planTime; // 生效计划时点 = manualTime ?? anchorTime + offsetDay

	private Short autoStatus; // 系统履约档位: 0未履约 1已下单 2已配送 3已到货

	private Timestamp autoTime; // 履约时间(下单=销售单创建/配送=tranTime/到货=confirmTime)

	private Integer salesCount; // 命中的有效销售单数

	private Short overdue; // 逾期: 1=计划时点已过且未完成且履约未达动作档位

	public MaterialPlanVO() {
		super();
	}

	public MaterialPlanVO(String orderId) {
		super();
		this.orderId = orderId;
	}

	public Long getMpid() {
		return mpid;
	}

	public void setMpid(Long mpid) {
		this.mpid = mpid;
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

	public Long getRuleId() {
		return ruleId;
	}

	public void setRuleId(Long ruleId) {
		this.ruleId = ruleId;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Long getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(Long categoryId) {
		this.categoryId = categoryId;
	}

	public String getCategoryName() {
		return categoryName;
	}

	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}

	public Long getBrandId() {
		return brandId;
	}

	public void setBrandId(Long brandId) {
		this.brandId = brandId;
	}

	public String getBrandName() {
		return brandName;
	}

	public void setBrandName(String brandName) {
		this.brandName = brandName;
	}

	public Long getCnid() {
		return cnid;
	}

	public void setCnid(Long cnid) {
		this.cnid = cnid;
	}

	public String getNodeName() {
		return nodeName;
	}

	public void setNodeName(String nodeName) {
		this.nodeName = nodeName;
	}

	public Short getAction() {
		return action;
	}

	public void setAction(Short action) {
		this.action = action;
	}

	public Short getAnchor() {
		return anchor;
	}

	public void setAnchor(Short anchor) {
		this.anchor = anchor;
	}

	public Integer getOffsetDay() {
		return offsetDay;
	}

	public void setOffsetDay(Integer offsetDay) {
		this.offsetDay = offsetDay;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getManualTime() {
		return manualTime;
	}

	public void setManualTime(Timestamp manualTime) {
		this.manualTime = manualTime;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getActualTime() {
		return actualTime;
	}

	public void setActualTime(Timestamp actualTime) {
		this.actualTime = actualTime;
	}

	public Long getOperater() {
		return operater;
	}

	public void setOperater(Long operater) {
		this.operater = operater;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getAnchorTime() {
		return anchorTime;
	}

	public void setAnchorTime(Timestamp anchorTime) {
		this.anchorTime = anchorTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getPlanTime() {
		return planTime;
	}

	public void setPlanTime(Timestamp planTime) {
		this.planTime = planTime;
	}

	public Short getAutoStatus() {
		return autoStatus;
	}

	public void setAutoStatus(Short autoStatus) {
		this.autoStatus = autoStatus;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getAutoTime() {
		return autoTime;
	}

	public void setAutoTime(Timestamp autoTime) {
		this.autoTime = autoTime;
	}

	public Integer getSalesCount() {
		return salesCount;
	}

	public void setSalesCount(Integer salesCount) {
		this.salesCount = salesCount;
	}

	public Short getOverdue() {
		return overdue;
	}

	public void setOverdue(Short overdue) {
		this.overdue = overdue;
	}

}
