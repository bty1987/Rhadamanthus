package com.fanglin.customer.po;

import static javax.persistence.GenerationType.IDENTITY;

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

import com.fanglin.customer.vo.CustomerProtectRuleVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "customerProtectRule", catalog = "customer")
public class CustomerProtectRulePO implements Serializable {

	private static final long serialVersionUID = -7196003936853844644L;

	public static final String COLUMN_TITLE_STR = "title";

	public static final String COLUMN_TYPE_STR = "type";

	public static final String COLUMN_VALUE_STR = "value";

	public static final String COLUMN_DAYS_STR = "days";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_COMPANY_STR = "company";

	public static final short STATUS_ABLE_SHORT = 0; // 有效

	public static final short STATUS_DISABLE_SHORT = 1; // 失效

	private long cprid;

	private String title;

	private short type; // 0: 面积 , 1: 预付 , 2: 设计

	private int value;

	private int days;

	private UserPO creater;

	private Timestamp createTime;

	private short status;

	private int company;

	public CustomerProtectRulePO() {
		super();
	}

	public CustomerProtectRulePO(long cprid) {
		super();
		this.cprid = cprid;
	}

	public CustomerProtectRulePO(UserPO creater) {
		super();
		this.creater = creater;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "cprid")
	public long getCprid() {
		return cprid;
	}

	public void setCprid(long cprid) {
		this.cprid = cprid;
	}

	@Column(name = "title")
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "value")
	public int getValue() {
		return value;
	}

	public void setValue(int value) {
		this.value = value;
	}

	@Column(name = "days")
	public int getDays() {
		return days;
	}

	public void setDays(int days) {
		this.days = days;
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

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	public CustomerProtectRuleVO ptv(CustomerProtectRuleVO customerProtectRuleVO) {

		BeanUtil.copyProperties(this, customerProtectRuleVO, Arrays.asList("creater"));

		if (customerProtectRuleVO.getCreater() != null && getCreater() != null) customerProtectRuleVO.getCreater().ptv(getCreater());

		return customerProtectRuleVO;
	}

}
