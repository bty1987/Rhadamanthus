package com.fanglin.information.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "activityrule", catalog = "information")
public class ActivityRulePO implements java.io.Serializable {

	private static final long serialVersionUID = 7632145098273645125L;

	public static final short RULETYPE_SIGN_INT = 1; // 签约赠

	public static final short RULETYPE_EVERY_INT = 2; // 预存每满

	public static final short RULETYPE_LADDER_INT = 3; // 预存阶梯

	public static final short RULETYPE_OALES_MERGE_INT = 4; // 场外款并入标记(与主材预存共用基数和门槛, 纯开关行不单独计张, 有此行才并入场外款)

	public static final short STATUS_ENABLED_INT = 0; // 启用

	public static final short STATUS_DISABLED_INT = 1; // 停用

	private long arId;

	private long aid;

	private short ruleType;

	private long asid;

	private long threshold;

	private Long perAmount;

	private int tickets;

	private int maxTickets;

	private int sort;

	private short status;

	private Timestamp createTime;

	public ActivityRulePO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "arId")
	public long getArId() {
		return arId;
	}

	public void setArId(long arId) {
		this.arId = arId;
	}

	@Column(name = "aid")
	public long getAid() {
		return aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}

	@Column(name = "ruleType")
	public short getRuleType() {
		return ruleType;
	}

	public void setRuleType(short ruleType) {
		this.ruleType = ruleType;
	}

	@Column(name = "asid")
	public long getAsid() {
		return asid;
	}

	public void setAsid(long asid) {
		this.asid = asid;
	}

	@Column(name = "threshold")
	public long getThreshold() {
		return threshold;
	}

	public void setThreshold(long threshold) {
		this.threshold = threshold;
	}

	@Column(name = "perAmount")
	public Long getPerAmount() {
		return perAmount;
	}

	public void setPerAmount(Long perAmount) {
		this.perAmount = perAmount;
	}

	@Column(name = "tickets")
	public int getTickets() {
		return tickets;
	}

	public void setTickets(int tickets) {
		this.tickets = tickets;
	}

	@Column(name = "maxTickets")
	public int getMaxTickets() {
		return maxTickets;
	}

	public void setMaxTickets(int maxTickets) {
		this.maxTickets = maxTickets;
	}

	@Column(name = "sort")
	public int getSort() {
		return sort;
	}

	public void setSort(int sort) {
		this.sort = sort;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}
}
