package com.fanglin.data.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.data.common.vo.MaterialPlanNodeVO;
import com.fanglin.utils.BeanUtil;

/**
 * 主材计划规则表(公司级字典): 品类/品牌 × 施工节点 × 动作(下单/配送/到货) × 锚点 × 偏移天数
 *
 */
@Entity
@Table(name = "materialplannode", catalog = "data")
public class MaterialPlanNodePO implements Serializable {

	private static final long serialVersionUID = -4714289306602889221L;

	public static final String COLUMN_COMPANY_STR = "company";
	public static final String COLUMN_STATUS_STR = "status";

	public static final short TYPE_CATEGORY_SHORT = 0; // 维度: 品类
	public static final short TYPE_BRAND_SHORT = 1; // 维度: 品牌

	public static final short ACTION_ORDER_INT = 0; // 动作: 下单
	public static final short ACTION_DELIVERY_INT = 1; // 动作: 配送
	public static final short ACTION_ARRIVAL_INT = 2; // 动作: 到货

	public static final short ANCHOR_PRE_START_INT = 0; // 锚点: 计划开工(schedule.preStartTime)
	public static final short ANCHOR_PRE_END_INT = 1; // 锚点: 计划完工(schedule.preEndTime)
	public static final short ANCHOR_START_INT = 2; // 锚点: 实际开工(schedule.startTime, 空回退计划开工)
	public static final short ANCHOR_END_INT = 3; // 锚点: 实际完工(schedule.endTime, 空回退计划完工)

	public static final short STATUS_ENABLE_SHORT = 0; // 启用
	public static final short STATUS_DISABLE_SHORT = 1; // 停用

	private long mpnid;

	private short type;

	private long cid;

	private long bid;

	private String categoryName;

	private String brandName;

	private long cnid;

	private String nodeName;

	private short action;

	private short anchor;

	private int offsetDay;

	private short status;

	private String comment;

	private long creater;

	private int company;

	private Timestamp createTime;

	public MaterialPlanNodePO() {
		super();
	}

	public MaterialPlanNodePO(long mpnid) {
		super();
		this.mpnid = mpnid;
	}

	@Id
	@GeneratedValue
	@Column(name = "mpnid")
	public long getMpnid() {
		return mpnid;
	}

	public void setMpnid(long mpnid) {
		this.mpnid = mpnid;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "cid")
	public long getCid() {
		return cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
	}

	@Column(name = "bid")
	public long getBid() {
		return bid;
	}

	public void setBid(long bid) {
		this.bid = bid;
	}

	@Column(name = "categoryName")
	public String getCategoryName() {
		return categoryName;
	}

	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
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

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "creater")
	public long getCreater() {
		return creater;
	}

	public void setCreater(long creater) {
		this.creater = creater;
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

	public MaterialPlanNodeVO ptv(MaterialPlanNodeVO materialPlanNodeVO) {

		BeanUtil.copyProperties(this, materialPlanNodeVO);

		return materialPlanNodeVO;
	}
}
