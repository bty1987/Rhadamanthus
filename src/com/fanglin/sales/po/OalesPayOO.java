package com.fanglin.sales.po;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;
import com.fanglin.sales.vo.OalesPayVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "oalespay", catalog = "sales")
public class OalesPayOO implements Serializable {

	private static final long serialVersionUID = 7639485438882576821L;

	public static final String COLUMN_COMPANY_STR = "company";

	public static final short TYPE_CASH_INT = 0;// 现金

	public static final short TYPE_BANK_INT = 1;// 银行

	public static final short TYPE_BILL_INT = 2;// 账扣

	public static final short TYPE_INTERIOL_INT = 3;// 内部

	private long opid;

	private OalesPO oales;

	private String name;

	private long money;

	private short type;

	private UserPO creater;

	private Timestamp createTime;

	private Timestamp payTime;

	private String comment;

	private int company;

	public OalesPayOO() {
		super();
	}

	public OalesPayOO(OalesPO oales, UserPO creater) {
		super();
		this.oales = oales;
		this.creater = creater;
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

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "oid", referencedColumnName = "oid")
	public OalesPO getOales() {
		return oales;
	}

	public void setOales(OalesPO oales) {
		this.oales = oales;
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

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	public OalesPayVO ptv(OalesPayVO oalesPayVO) {

		BeanUtil.copyProperties(this, oalesPayVO, Arrays.asList("oales", "creater"));

		if (oalesPayVO.getCreater() != null) BeanUtil.copyProperties(getCreater(), oalesPayVO.getCreater(), Arrays.asList("dept", "duty"));

		if (oalesPayVO.getOales() != null) getOales().ptv(oalesPayVO.getOales());

		return oalesPayVO;
	}
}
