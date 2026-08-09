package com.fanglin.report.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 财务收款日级汇总（report.metric_payment_daily）。
 *
 * <p>由 {@code PaymentMetricCalculator.rebuild()} 每日全量重算，跨库只读聚合
 * {@code payment.receipt}（统一收据流水），{@code INSERT ... ON DUPLICATE KEY UPDATE} 幂等写入。
 * 唯一键 {@code (stat_date, company, type, paymentType)} 保证重复跑不累加。
 *
 * <p>口径说明：
 * <ul>
 *   <li>type：0 收款 / 1 退款（receipt.type）。</li>
 *   <li>paymentType：0 预付款 / 1 装修款 / 2 主材款 / 3 其他（receipt.paymentType）。</li>
 *   <li>按 collectTime 归日，company 隔离租户。</li>
 * </ul>
 *
 * @see com.fanglin.report.service.impl.PaymentMetricCalculator
 */
@Entity
@Table(name = "metric_payment_daily", catalog = "report")
public class PaymentDailyMetricPO implements java.io.Serializable {

	private static final long serialVersionUID = 1L;

	private long pmid;

	private String statDate; // 统计日期 yyyy-MM-dd

	private int company; // 公司

	private short type; // 0 收款 / 1 退款

	private short paymentType; // 0 预付款 / 1 装修款 / 2 主材款 / 3 其他

	private long count; // 笔数

	private long amount; // 金额（单位分）

	public PaymentDailyMetricPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "pmid")
	public long getPmid() {
		return pmid;
	}

	public void setPmid(long pmid) {
		this.pmid = pmid;
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

	@Column(name = "type", nullable = false)
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "payment_type", nullable = false)
	public short getPaymentType() {
		return paymentType;
	}

	public void setPaymentType(short paymentType) {
		this.paymentType = paymentType;
	}

	@Column(name = "count")
	public long getCount() {
		return count;
	}

	public void setCount(long count) {
		this.count = count;
	}

	@Column(name = "amount")
	public long getAmount() {
		return amount;
	}

	public void setAmount(long amount) {
		this.amount = amount;
	}

}
