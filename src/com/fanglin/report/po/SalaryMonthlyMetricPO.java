package com.fanglin.report.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 人力薪酬月级汇总（report.metric_salary_monthly）。
 *
 * <p>由 {@code SalaryMetricCalculator.rebuild()} 每日全量重算，跨库只读聚合
 * {@code salary.workersalary}（工人工费），按 createTime 归月，仅统计已通过单（status=1）。
 * 唯一键 {@code (stat_month, company, twotype)}。
 *
 * <p>口径（workersalary.twotype 工种分类）：
 * <ul>
 *   <li>1 工费 / 2 增项 / 3 油工奖励 / 4 维修款 / 11 预支 / 12 家属保险 / 13 罚款 / 14 工程质保金</li>
 * </ul>
 *
 * @see com.fanglin.report.service.impl.SalaryMetricCalculator
 */
@Entity
@Table(name = "metric_salary_monthly", catalog = "report")
public class SalaryMonthlyMetricPO implements java.io.Serializable {

	private static final long serialVersionUID = 1L;

	private long smid;

	private String statMonth; // 统计月份 yyyy-MM

	private int company; // 公司

	private short twotype; // 工种分类（1工费/2增项/3油工奖励...）

	private long salaryCount; // 工费单量

	private long totalSalary; // 实发总额（分）

	public SalaryMonthlyMetricPO() {
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

	@Column(name = "twotype", nullable = false)
	public short getTwotype() {
		return twotype;
	}

	public void setTwotype(short twotype) {
		this.twotype = twotype;
	}

	@Column(name = "salary_count")
	public long getSalaryCount() {
		return salaryCount;
	}

	public void setSalaryCount(long salaryCount) {
		this.salaryCount = salaryCount;
	}

	@Column(name = "total_salary")
	public long getTotalSalary() {
		return totalSalary;
	}

	public void setTotalSalary(long totalSalary) {
		this.totalSalary = totalSalary;
	}

}
