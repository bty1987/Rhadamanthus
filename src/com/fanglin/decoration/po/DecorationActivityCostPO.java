package com.fanglin.decoration.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 优惠额度校验缓存表: 额度类活动物品(type>=10)创建校验通过后, 缓存 fl-yy validate 接口响应快照。
 * 
 * <p>
 * 只写档: 不展示、不参与校验判定(校验永远实时调接口)、系统逻辑不读(读场景仅人工排查与对账)。
 */
@Entity
@Table(name = "decorationactivitycost", catalog = "decoration")
public class DecorationActivityCostPO implements java.io.Serializable {

	private static final long serialVersionUID = 1L;

	private long dacId;

	private String orderId;

	private long daiId;

	private int money;

	private Integer balance;

	private Integer toplimit;

	private Integer company;

	private Timestamp createTime;

	public DecorationActivityCostPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "dacId")
	public long getDacId() {
		return dacId;
	}

	public void setDacId(long dacId) {
		this.dacId = dacId;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "daiId")
	public long getDaiId() {
		return daiId;
	}

	public void setDaiId(long daiId) {
		this.daiId = daiId;
	}

	@Column(name = "money")
	public int getMoney() {
		return money;
	}

	public void setMoney(int money) {
		this.money = money;
	}

	@Column(name = "balance")
	public Integer getBalance() {
		return balance;
	}

	public void setBalance(Integer balance) {
		this.balance = balance;
	}

	@Column(name = "toplimit")
	public Integer getToplimit() {
		return toplimit;
	}

	public void setToplimit(Integer toplimit) {
		this.toplimit = toplimit;
	}

	@Column(name = "company")
	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

}
