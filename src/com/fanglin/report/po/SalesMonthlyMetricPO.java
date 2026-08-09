package com.fanglin.report.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 主材销售月级汇总（report.metric_sales_monthly）。
 *
 * <p>由 {@code SalesMetricCalculator.rebuild()} 每日全量重算，跨库只读聚合 sales.sales，
 * 按 createTime 归月，排除作废单（status != 4）。唯一键 {@code (stat_month, company, category)}。
 *
 * @see com.fanglin.report.service.impl.SalesMetricCalculator
 */
@Entity
@Table(name = "metric_sales_monthly", catalog = "report")
public class SalesMonthlyMetricPO implements java.io.Serializable {

	private static final long serialVersionUID = 1L;

	private long smid;

	private String statMonth; // 统计月份 yyyy-MM

	private int company; // 公司

	private String category; // 品类（橱柜/全屋定制/电器/瓷砖...，空品类归为"未分类"）

	private long salesCount; // 销售单量

	private long totalAmount; // 销售总额（分）

	public SalesMonthlyMetricPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "smid")
	public long getSmid() {
		return smid;
	}

	public void setSmid(long smid) {
		this.smid = smid;
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

	@Column(name = "category", nullable = false)
	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	@Column(name = "sales_count")
	public long getSalesCount() {
		return salesCount;
	}

	public void setSalesCount(long salesCount) {
		this.salesCount = salesCount;
	}

	@Column(name = "total_amount")
	public long getTotalAmount() {
		return totalAmount;
	}

	public void setTotalAmount(long totalAmount) {
		this.totalAmount = totalAmount;
	}

}
