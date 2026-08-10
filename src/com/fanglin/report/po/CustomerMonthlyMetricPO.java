package com.fanglin.report.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 客户获客月级汇总（report.metric_customer_monthly）。
 *
 * <p>由 {@code CustomerMetricCalculator.rebuild()} 每日全量重算，跨库只读聚合
 * {@code customer.customersource}（客户源），按 createTime 归月。
 * 唯一键 {@code (stat_month, company, source)}。
 *
 * <p>口径（customersource.status）：
 * <ul>
 *   <li>total：报备量（全部客户源创建量）。</li>
 *   <li>confirm：确认量（status &gt;= 3，含确认/二审/转换）。</li>
 *   <li>convert：转单量（status = 5，已转装修单）。</li>
 *   <li>invalid：失效量（status = 1）。</li>
 * </ul>
 *
 * @see com.fanglin.report.service.impl.CustomerMetricCalculator
 */
@Entity
@Table(name = "metric_customer_monthly", catalog = "report")
public class CustomerMonthlyMetricPO implements java.io.Serializable {

	private static final long serialVersionUID = 1L;

	private long cmid;

	private String statMonth; // 统计月份 yyyy-MM

	private int company; // 公司

	private String source; // 来源渠道（空归为"未分类"）

	private long totalCount; // 报备量（全部）

	private long confirmCount; // 确认量（status >= 3）

	private long convertCount; // 转单量（status = 5）

	private long invalidCount; // 失效量（status = 1）

	public CustomerMonthlyMetricPO() {
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

	@Column(name = "source", nullable = false)
	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}

	@Column(name = "total_count")
	public long getTotalCount() {
		return totalCount;
	}

	public void setTotalCount(long totalCount) {
		this.totalCount = totalCount;
	}

	@Column(name = "confirm_count")
	public long getConfirmCount() {
		return confirmCount;
	}

	public void setConfirmCount(long confirmCount) {
		this.confirmCount = confirmCount;
	}

	@Column(name = "convert_count")
	public long getConvertCount() {
		return convertCount;
	}

	public void setConvertCount(long convertCount) {
		this.convertCount = convertCount;
	}

	@Column(name = "invalid_count")
	public long getInvalidCount() {
		return invalidCount;
	}

	public void setInvalidCount(long invalidCount) {
		this.invalidCount = invalidCount;
	}

}
