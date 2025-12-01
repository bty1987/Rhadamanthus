package com.fanglin.balance.po;

import static javax.persistence.GenerationType.IDENTITY;

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

import com.fanglin.balance.vo.BalanceAccountVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "balanceaccount", catalog = "balance")
public class BalanceAccountPO implements java.io.Serializable {

	private static final long serialVersionUID = 2860500304478428213L;

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_BELONGER_UID_STR = "belonger.uid";

	public static final String COLUMN_TYPE_STR = "type";

	public static final short TYPE_VALID_SHORT = 0;// 结算

	public static final short TYPE_UNVALID_SHORT = 1;// 出纳

	public static final short STATUS_VALID_SHORT = 0; // 有效

	public static final short STATUS_UNVALID_SHORT = 1; // 无效

	private long baid;

	private String name;

	private String no;

	private String address;

	private String phone;

	private String bank;

	private String bankno;

	private UserPO belonger;

	private UserPO creater;

	private Timestamp createTime;

	private long referMoney;

	private long realMoney;

	private long surplus;

	private short type;

	private short status;

	private int company;

	public BalanceAccountPO() {
		super();
	}

	public BalanceAccountPO(UserPO belonger, UserPO creater) {
		super();
		this.belonger = belonger;
		this.creater = creater;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "baid")
	public long getBaid() {
		return baid;
	}

	public void setBaid(long baid) {
		this.baid = baid;
	}

	@Column(name = "no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "address")
	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	@Column(name = "phone")
	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	@Column(name = "bank")
	public String getBank() {
		return bank;
	}

	public void setBank(String bank) {
		this.bank = bank;
	}

	@Column(name = "bankno")
	public String getBankno() {
		return bankno;
	}

	public void setBankno(String bankno) {
		this.bankno = bankno;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "buid", referencedColumnName = "uid")
	public UserPO getBelonger() {
		return belonger;
	}

	public void setBelonger(UserPO belonger) {
		this.belonger = belonger;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "cuid", referencedColumnName = "uid")
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

	@Column(name = "referMoney")
	public long getReferMoney() {
		return referMoney;
	}

	public void setReferMoney(long referMoney) {
		this.referMoney = referMoney;
	}

	@Column(name = "realMoney")
	public long getRealMoney() {
		return realMoney;
	}

	public void setRealMoney(long realMoney) {
		this.realMoney = realMoney;
	}

	@Column(name = "surplus")
	public long getSurplus() {
		return surplus;
	}

	public void setSurplus(long surplus) {
		this.surplus = surplus;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
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

	public BalanceAccountVO ptv(BalanceAccountVO balanceAccountVO) {

		BeanUtil.copyProperties(this, balanceAccountVO, Arrays.asList("creater", "belonger"));

		if (balanceAccountVO.getCreater() != null && getCreater() != null) balanceAccountVO.getCreater().setBaseInfo(getCreater());
		if (balanceAccountVO.getBelonger() != null && getBelonger() != null) balanceAccountVO.getBelonger().setBaseInfo(getBelonger());

		return balanceAccountVO;
	}
}
