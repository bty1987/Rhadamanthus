package com.fanglin.report.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 报价偏差月级汇总（report.metric_quotation_monthly）。
 *
 * <p>由 {@code QuotationMetricCalculator.rebuild()} 每日全量重算，
 * 跨库只读聚合 quotation.quotation + decoration.decoration，
 * 按签约月（contractTime 归月）统计报价额 vs 签约额偏差。
 *
 * @see com.fanglin.report.service.impl.QuotationMetricCalculator
 */
@Entity
@Table(name = "metric_quotation_monthly", catalog = "report")
public class QuotationMonthlyMetricPO implements java.io.Serializable {

	private static final long serialVersionUID = 1L;

	private long qmid;

	private String statMonth; // 统计月份 yyyy-MM（按签约月）

	private int company; // 公司

	private long quotationCount; // 报价单量（默认报价数）

	private long avgQuotationAmount; // 平均报价额（分）

	private long avgSignAmount; // 平均签约额（分）

	private long avgDiffAmount; // 平均偏差额（签约-报价，分）

	public QuotationMonthlyMetricPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "qmid")
	public long getQmid() {
		return qmid;
	}

	public void setQmid(long qmid) {
		this.qmid = qmid;
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

	@Column(name = "quotation_count")
	public long getQuotationCount() {
		return quotationCount;
	}

	public void setQuotationCount(long quotationCount) {
		this.quotationCount = quotationCount;
	}

	@Column(name = "avg_quotation_amount")
	public long getAvgQuotationAmount() {
		return avgQuotationAmount;
	}

	public void setAvgQuotationAmount(long avgQuotationAmount) {
		this.avgQuotationAmount = avgQuotationAmount;
	}

	@Column(name = "avg_sign_amount")
	public long getAvgSignAmount() {
		return avgSignAmount;
	}

	public void setAvgSignAmount(long avgSignAmount) {
		this.avgSignAmount = avgSignAmount;
	}

	@Column(name = "avg_diff_amount")
	public long getAvgDiffAmount() {
		return avgDiffAmount;
	}

	public void setAvgDiffAmount(long avgDiffAmount) {
		this.avgDiffAmount = avgDiffAmount;
	}

}
