package com.fanglin.report.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 审批运营月级汇总（report.metric_approval_monthly）。
 *
 * <p>由 {@code ApprovalMetricCalculator.rebuild()} 每日全量重算，跨库只读聚合
 * {@code approval.approval}，按 createTime 归月。唯一键 {@code (stat_month, company, type)}。
 *
 * <p>口径（approval.status）：
 * <ul>
 *   <li>totalCount：审批总量（全部状态）。</li>
 *   <li>rejectCount：拒绝量（status = 2）。</li>
 *   <li>avgDurationHours：平均审批耗时（小时，基于 status=2 的 approvalTime-createTime）。</li>
 * </ul>
 *
 * @see com.fanglin.report.service.impl.ApprovalMetricCalculator
 */
@Entity
@Table(name = "metric_approval_monthly", catalog = "report")
public class ApprovalMonthlyMetricPO implements java.io.Serializable {

	private static final long serialVersionUID = 1L;

	private long amid;

	private String statMonth; // 统计月份 yyyy-MM

	private int company; // 公司

	private short type; // 审批类型（20客源/10销售退款/8装修活动/3装修归属...）

	private long totalCount; // 审批总量

	private long rejectCount; // 拒绝量（status=2）

	private long avgDurationHours; // 平均审批耗时（小时）

	public ApprovalMonthlyMetricPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "amid")
	public long getAmid() {
		return amid;
	}

	public void setAmid(long amid) {
		this.amid = amid;
	}

	@Column(name = "stat_month", nullable = false)
	public String getStatMonth() {
		return statMonth;
	}

	public void setStatMonth(String statMonth) {
		this.statMonth = statMonth;
	}

	@Column(name = "company", nullable = false)
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	@Column(name = "type", nullable = false)
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "total_count")
	public long getTotalCount() {
		return totalCount;
	}

	public void setTotalCount(long totalCount) {
		this.totalCount = totalCount;
	}

	@Column(name = "reject_count")
	public long getRejectCount() {
		return rejectCount;
	}

	public void setRejectCount(long rejectCount) {
		this.rejectCount = rejectCount;
	}

	@Column(name = "avg_duration_hours")
	public long getAvgDurationHours() {
		return avgDurationHours;
	}

	public void setAvgDurationHours(long avgDurationHours) {
		this.avgDurationHours = avgDurationHours;
	}

}
