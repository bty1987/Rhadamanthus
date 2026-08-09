package com.fanglin.report.analytics.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 装修销售转化日级汇总（report.metric_decoration_daily）。
 *
 * <p>由 {@code DecorationDomainCalculator.rebuild()} 每日全量重算，跨库只读聚合
 * {@code decoration.decoration}，{@code INSERT ... ON DUPLICATE KEY UPDATE} 幂等写入。
 * 唯一键 {@code (stat_date, company)} 保证重复跑不累加。
 *
 * <p>口径说明：
 * <ul>
 *   <li>状态计数（measure/deposit/.../complete）：按 {@code createTime} 归日，反映获客与流转。</li>
 *   <li>签约额 signAmount：按 {@code contractTime} 归日（仅签约及以上单有合同时间）。</li>
 * </ul>
 *
 * <p>本表属于 report 全新 analytics 子域，与旧 {@code DecorationReportPO} 等互不干扰。
 *
 * @see com.fanglin.report.analytics.domain.DecorationDomainCalculator
 */
@Entity
@Table(name = "metric_decoration_daily", catalog = "report")
public class DecorationDailyMetricPO implements java.io.Serializable {

	private static final long serialVersionUID = 1L;

	private long mdid;

	private String statDate; // 统计日期 yyyy-MM-dd

	private int company; // 公司

	// ---- 订单状态计数（按 createTime 归日）----
	private long measureCount; // 量尺数（全部订单，status 任意，即订单创建量）

	private long depositCount; // 定金（status >= 1）

	private long presignCount; // 预签（status >= 2）

	private long signCount; // 签约（status >= 3）

	private long resignCount; // 重签（status = 4）

	private long finalCount; // 决算（status >= 7）

	private long completeCount; // 完工（status >= 8）

	private long wasteCount; // 废单（status = 5）

	private long terminationCount; // 终止（status = 6）

	// ---- 签约额（按 contractTime 归日）----
	private long signAmount; // 签约总额（orderTotalPrice 之和，单位分）

	// ---- 装修类型分布（按 createTime 归日）----
	private long midpackCount; // 半包（type = 0）

	private long inclusiveCount; // 整装（type = 1）

	private long holonomyCount; // 大包（type = 2）

	public DecorationDailyMetricPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "mdid")
	public long getMdid() {
		return mdid;
	}

	public void setMdid(long mdid) {
		this.mdid = mdid;
	}

	@Column(name = "stat_date", nullable = false)
	public String getStatDate() {
		return statDate;
	}

	public void setStatDate(String statDate) {
		this.statDate = statDate;
	}

	@Column(name = "company", nullable = false)
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	@Column(name = "measure_count")
	public long getMeasureCount() {
		return measureCount;
	}

	public void setMeasureCount(long measureCount) {
		this.measureCount = measureCount;
	}

	@Column(name = "deposit_count")
	public long getDepositCount() {
		return depositCount;
	}

	public void setDepositCount(long depositCount) {
		this.depositCount = depositCount;
	}

	@Column(name = "presign_count")
	public long getPresignCount() {
		return presignCount;
	}

	public void setPresignCount(long presignCount) {
		this.presignCount = presignCount;
	}

	@Column(name = "sign_count")
	public long getSignCount() {
		return signCount;
	}

	public void setSignCount(long signCount) {
		this.signCount = signCount;
	}

	@Column(name = "resign_count")
	public long getResignCount() {
		return resignCount;
	}

	public void setResignCount(long resignCount) {
		this.resignCount = resignCount;
	}

	@Column(name = "final_count")
	public long getFinalCount() {
		return finalCount;
	}

	public void setFinalCount(long finalCount) {
		this.finalCount = finalCount;
	}

	@Column(name = "complete_count")
	public long getCompleteCount() {
		return completeCount;
	}

	public void setCompleteCount(long completeCount) {
		this.completeCount = completeCount;
	}

	@Column(name = "waste_count")
	public long getWasteCount() {
		return wasteCount;
	}

	public void setWasteCount(long wasteCount) {
		this.wasteCount = wasteCount;
	}

	@Column(name = "termination_count")
	public long getTerminationCount() {
		return terminationCount;
	}

	public void setTerminationCount(long terminationCount) {
		this.terminationCount = terminationCount;
	}

	@Column(name = "sign_amount")
	public long getSignAmount() {
		return signAmount;
	}

	public void setSignAmount(long signAmount) {
		this.signAmount = signAmount;
	}

	@Column(name = "midpack_count")
	public long getMidpackCount() {
		return midpackCount;
	}

	public void setMidpackCount(long midpackCount) {
		this.midpackCount = midpackCount;
	}

	@Column(name = "inclusive_count")
	public long getInclusiveCount() {
		return inclusiveCount;
	}

	public void setInclusiveCount(long inclusiveCount) {
		this.inclusiveCount = inclusiveCount;
	}

	@Column(name = "holonomy_count")
	public long getHolonomyCount() {
		return holonomyCount;
	}

	public void setHolonomyCount(long holonomyCount) {
		this.holonomyCount = holonomyCount;
	}

}
