package com.fanglin.construction.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.construction.vo.MaterialPlanVO;
import com.fanglin.utils.BeanUtil;

/**
 * 主材计划表(订单级实例): 生成时从 data.materialplannode 规则快照, 计划时点按锚点读时推算不落库
 *
 */
@Entity
@Table(name = "materialplan", catalog = "construction")
public class MaterialPlanPO implements Serializable {

	private static final long serialVersionUID = -5298804612390117661L;

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final short TYPE_CATEGORY_SHORT = 0; // 维度: 品类
	public static final short TYPE_BRAND_SHORT = 1; // 维度: 品牌

	public static final short ACTION_ORDER_INT = 0; // 动作: 下单
	public static final short ACTION_DELIVERY_INT = 1; // 动作: 配送
	public static final short ACTION_ARRIVAL_INT = 2; // 动作: 到货

	public static final short ANCHOR_PRE_START_INT = 0; // 锚点: 计划开工(schedule.preStartTime)
	public static final short ANCHOR_PRE_END_INT = 1; // 锚点: 计划完工(schedule.preEndTime)
	public static final short ANCHOR_START_INT = 2; // 锚点: 实际开工(schedule.startTime, 空回退计划开工)
	public static final short ANCHOR_END_INT = 3; // 锚点: 实际完工(schedule.endTime, 空回退计划完工)

	public static final short STATUS_INIT_INT = 0; // 未完成
	public static final short STATUS_CONFIRM_INT = 1; // 已完成(手工)
	public static final short STATUS_CANCEL_INT = 2; // 已取消

	public static final short AUTO_NONE_INT = 0; // 系统履约: 未履约
	public static final short AUTO_ORDERED_INT = 1; // 系统履约: 已下单
	public static final short AUTO_DELIVERED_INT = 2; // 系统履约: 已配送
	public static final short AUTO_ARRIVED_INT = 3; // 系统履约: 已到货

	private long mpid;

	private long cid;

	private String orderId;

	private long ruleId;

	private short type;

	private long categoryId;

	private String categoryName;

	private long brandId;

	private String brandName;

	private long cnid;

	private String nodeName;

	private short action;

	private short anchor;

	private int offsetDay;

	private Timestamp manualTime;

	private short status;

	private Timestamp actualTime;

	private long operater;

	private String comment;

	private int company;

	private Timestamp createTime;

	public MaterialPlanPO() {
		super();
	}

	public MaterialPlanPO(long mpid) {
		super();
		this.mpid = mpid;
	}

	@Id
	@GeneratedValue
	@Column(name = "mpid")
	public long getMpid() {
		return mpid;
	}

	public void setMpid(long mpid) {
		this.mpid = mpid;
	}

	@Column(name = "cid")
	public long getCid() {
		return cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "ruleId")
	public long getRuleId() {
		return ruleId;
	}

	public void setRuleId(long ruleId) {
		this.ruleId = ruleId;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "categoryId")
	public long getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(long categoryId) {
		this.categoryId = categoryId;
	}

	@Column(name = "categoryName")
	public String getCategoryName() {
		return categoryName;
	}

	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}

	@Column(name = "brandId")
	public long getBrandId() {
		return brandId;
	}

	public void setBrandId(long brandId) {
		this.brandId = brandId;
	}

	@Column(name = "brandName")
	public String getBrandName() {
		return brandName;
	}

	public void setBrandName(String brandName) {
		this.brandName = brandName;
	}

	@Column(name = "cnid")
	public long getCnid() {
		return cnid;
	}

	public void setCnid(long cnid) {
		this.cnid = cnid;
	}

	@Column(name = "nodeName")
	public String getNodeName() {
		return nodeName;
	}

	public void setNodeName(String nodeName) {
		this.nodeName = nodeName;
	}

	@Column(name = "action")
	public short getAction() {
		return action;
	}

	public void setAction(short action) {
		this.action = action;
	}

	@Column(name = "anchor")
	public short getAnchor() {
		return anchor;
	}

	public void setAnchor(short anchor) {
		this.anchor = anchor;
	}

	@Column(name = "offsetDay")
	public int getOffsetDay() {
		return offsetDay;
	}

	public void setOffsetDay(int offsetDay) {
		this.offsetDay = offsetDay;
	}

	@Column(name = "manualTime")
	public Timestamp getManualTime() {
		return manualTime;
	}

	public void setManualTime(Timestamp manualTime) {
		this.manualTime = manualTime;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "actualTime")
	public Timestamp getActualTime() {
		return actualTime;
	}

	public void setActualTime(Timestamp actualTime) {
		this.actualTime = actualTime;
	}

	@Column(name = "operater")
	public long getOperater() {
		return operater;
	}

	public void setOperater(long operater) {
		this.operater = operater;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public MaterialPlanVO ptv(MaterialPlanVO materialPlanVO) {

		BeanUtil.copyProperties(this, materialPlanVO);

		return materialPlanVO;
	}
}
