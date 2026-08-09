package com.fanglin.report.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 施工履约月级汇总（report.metric_construction_monthly）。
 *
 * <p>由 {@code ConstructionMetricCalculator.rebuild()} 每日全量重算，
 * 跨库只读聚合 construction.construction + construction.constructioninfo + decoration.decoration，
 * {@code INSERT ... ON DUPLICATE KEY UPDATE} 幂等写入。唯一键 {@code (stat_month, company)}。
 *
 * <p>口径：按开工月（startTime 归月）统计开工量；完工量按 finishTime 归月；
 * 在建数为该月末仍 process=0 的工地数（近似：开工且未完工）。
 *
 * @see com.fanglin.report.service.impl.ConstructionMetricCalculator
 */
@Entity
@Table(name = "metric_construction_monthly", catalog = "report")
public class ConstructionMonthlyMetricPO implements java.io.Serializable {

	private static final long serialVersionUID = 1L;

	private long cmid;

	private String statMonth; // 统计月份 yyyy-MM

	private int company; // 公司

	private long startCount; // 开工量（startTime 落在该月）

	private long finishCount; // 完工量（process=1 且 finishTime 落在该月）

	private long ongoingCount; // 在建数（开工且未完工）

	private long avgActualPeriod; // 平均实际工期（天，constructioninfo.actuaTime 均值）

	private long avgPlanPeriod; // 平均计划工期（天，constructioninfo.timeLimit 均值）

	private long overdueCount; // 超期数（实际工期 > 计划工期）

	public ConstructionMonthlyMetricPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "cmid")
	public long getCmid() {
		return cmid;
	}

	public void setCmid(long cmid) {
		this.cmid = cmid;
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

	@Column(name = "start_count")
	public long getStartCount() {
		return startCount;
	}

	public void setStartCount(long startCount) {
		this.startCount = startCount;
	}

	@Column(name = "finish_count")
	public long getFinishCount() {
		return finishCount;
	}

	public void setFinishCount(long finishCount) {
		this.finishCount = finishCount;
	}

	@Column(name = "ongoing_count")
	public long getOngoingCount() {
		return ongoingCount;
	}

	public void setOngoingCount(long ongoingCount) {
		this.ongoingCount = ongoingCount;
	}

	@Column(name = "avg_actual_period")
	public long getAvgActualPeriod() {
		return avgActualPeriod;
	}

	public void setAvgActualPeriod(long avgActualPeriod) {
		this.avgActualPeriod = avgActualPeriod;
	}

	@Column(name = "avg_plan_period")
	public long getAvgPlanPeriod() {
		return avgPlanPeriod;
	}

	public void setAvgPlanPeriod(long avgPlanPeriod) {
		this.avgPlanPeriod = avgPlanPeriod;
	}

	@Column(name = "overdue_count")
	public long getOverdueCount() {
		return overdueCount;
	}

	public void setOverdueCount(long overdueCount) {
		this.overdueCount = overdueCount;
	}

}
