package com.fanglin.data.common.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.data.po.MaterialPlanNodePO;

public class MaterialPlanNodeVO implements Serializable {

	private static final long serialVersionUID = 2894663095221189643L;

	private Long mpnid;

	private Short type;

	private Long cid;

	private Long bid;

	private String categoryName;

	private String brandName;

	private Long cnid;

	private String nodeName;

	private Short action;

	private Short anchor;

	private Integer offsetDay;

	private Short status;

	private String comment;

	private Long creater;

	private Integer company;

	private Timestamp createTime;

	public MaterialPlanNodeVO() {
		super();
	}

	public MaterialPlanNodeVO(Long mpnid) {
		super();
		this.mpnid = mpnid;
	}

	public Long getMpnid() {
		return mpnid;
	}

	public void setMpnid(Long mpnid) {
		this.mpnid = mpnid;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public Long getBid() {
		return bid;
	}

	public void setBid(Long bid) {
		this.bid = bid;
	}

	public String getCategoryName() {
		return categoryName;
	}

	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
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

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Long getCreater() {
		return creater;
	}

	public void setCreater(Long creater) {
		this.creater = creater;
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

	public MaterialPlanNodePO clone(MaterialPlanNodePO materialPlanNodePO) {

		materialPlanNodePO.setType(type == null ? MaterialPlanNodePO.TYPE_CATEGORY_SHORT : type);
		materialPlanNodePO.setCid(cid == null ? 0L : cid);
		materialPlanNodePO.setBid(bid == null ? 0L : bid);
		materialPlanNodePO.setCnid(cnid == null ? 0L : cnid);
		materialPlanNodePO.setAction(action == null ? MaterialPlanNodePO.ACTION_ORDER_INT : action);
		materialPlanNodePO.setAnchor(anchor == null ? MaterialPlanNodePO.ANCHOR_PRE_START_INT : anchor);
		materialPlanNodePO.setOffsetDay(offsetDay == null ? 0 : offsetDay);
		materialPlanNodePO.setCompany(company == null ? 0 : company);

		return materialPlanNodePO;
	}

}
