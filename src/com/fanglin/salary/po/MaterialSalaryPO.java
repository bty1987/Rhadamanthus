package com.fanglin.salary.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.sales.po.SalesPO;

@Entity
@Table(name = "materialsalary", catalog = "salary")
public class MaterialSalaryPO implements Serializable {

	private static final long serialVersionUID = -269713946747011445L;

	public static final String COLUMN_BELONGER_STR = "belonger.userId";

	public static final String COLUMN_STAGE_STR = "stage";

	private long msid;

	private DecorationPO decoration;

	private SalesPO sales;

	private long sbid;

	private UserPO belonger;

	private Timestamp createTime;

	private String period;

	private int money;

	private int rate;

	private short stage;

	private short status;

	private String comment;

	public MaterialSalaryPO() {
		super();
	}

	@Id
	@GeneratedValue
	@Column(name = "msid")
	public long getMsid() {
		return msid;
	}

	public void setMsid(long msid) {
		this.msid = msid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "orderId", referencedColumnName = "orderId")
	public DecorationPO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationPO decoration) {
		this.decoration = decoration;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "sid", referencedColumnName = "sid")
	public SalesPO getSales() {
		return sales;
	}

	public void setSales(SalesPO sales) {
		this.sales = sales;
	}

	@Column(name = "sbid")
	public long getSbid() {
		return sbid;
	}

	public void setSbid(long sbid) {
		this.sbid = sbid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "buid", referencedColumnName = "uid")
	public UserPO getBelonger() {
		return belonger;
	}

	public void setBelonger(UserPO belonger) {
		this.belonger = belonger;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "period")
	public String getPeriod() {
		return period;
	}

	public void setPeriod(String period) {
		this.period = period;
	}

	@Column(name = "money")
	public int getMoney() {
		return money;
	}

	public void setMoney(int money) {
		this.money = money;
	}

	@Column(name = "rate")
	public int getRate() {
		return rate;
	}

	public void setRate(int rate) {
		this.rate = rate;
	}

	@Column(name = "stage")
	public short getStage() {
		return stage;
	}

	public void setStage(short stage) {
		this.stage = stage;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
