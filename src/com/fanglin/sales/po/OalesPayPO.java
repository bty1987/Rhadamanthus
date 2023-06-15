package com.fanglin.sales.po;

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

import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.po.HousePO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "oalespay", catalog = "sales")
public class OalesPayPO implements Serializable {

	private static final long serialVersionUID = -6594193722223451343L;

	public static final String COLUMN_OID_STR = "oid";

	public static final short TYPE_CASH_INT = 0;// 现金

	public static final short TYPE_BANK_INT = 1;// 银行

	public static final short TYPE_BILL_INT = 2;// 账扣

	public static final short TYPE_INTERIOL_INT = 3;// 内部

	private long opid;

	private long oid;

	private String name;

	private long money;

	private short type;

	private UserPO creater;

	private Timestamp createTime;

	private Timestamp payTime;

	private String comment;

	public OalesPayPO() {
		super();
	}

	public OalesPayPO(HousePO house, CustomerPO customer, UserPO supplier) {
		super();
	}

	@Id
	@GeneratedValue
	@Column(name = "opid")
	public long getOpid() {
		return opid;
	}

	public void setOpid(long opid) {
		this.opid = opid;
	}

	@Column(name = "oid")
	public long getOid() {
		return oid;
	}

	public void setOid(long oid) {
		this.oid = oid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "money")
	public long getMoney() {
		return money;
	}

	public void setMoney(long money) {
		this.money = money;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "payTime")
	public Timestamp getPayTime() {
		return payTime;
	}

	public void setPayTime(Timestamp payTime) {
		this.payTime = payTime;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
}
