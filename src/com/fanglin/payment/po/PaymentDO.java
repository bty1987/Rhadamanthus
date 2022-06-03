package com.fanglin.payment.po;

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

import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.payment.vo.PaymentVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "payment", catalog = "payment")
public class PaymentDO implements Serializable {

	private static final long serialVersionUID = -2510739017535057640L;

	private long pid;

	private AdvanceReceiptPO advanceReceipt;

	private DecorationPO decoration;

	private CustomerPO customer;

	private long balance;

	private long recharge;

	private short type;

	private short paymentType;

	private short status;

	private int company;

	private UserPO creater;

	private Timestamp createTime;

	private String uniqueid;

	public PaymentDO() {
		super();
	}

	@Id
	@GeneratedValue
	@Column(name = "pid")
	public long getPid() {
		return pid;
	}

	public void setPid(long pid) {
		this.pid = pid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "arId", referencedColumnName = "arId")
	public AdvanceReceiptPO getAdvanceReceipt() {
		return advanceReceipt;
	}

	public void setAdvanceReceipt(AdvanceReceiptPO advanceReceipt) {
		this.advanceReceipt = advanceReceipt;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "orderId", referencedColumnName = "orderId")
	public DecorationPO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationPO decoration) {
		this.decoration = decoration;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "customerId", referencedColumnName = "cid")
	public CustomerPO getCustomer() {
		return customer;
	}

	public void setCustomer(CustomerPO customer) {
		this.customer = customer;
	}

	@Column(nullable = false, name = "balance")
	public long getBalance() {
		return balance;
	}

	public void setBalance(long balance) {
		this.balance = balance;
	}

	@Column(nullable = false, name = "recharge")
	public long getRecharge() {
		return recharge;
	}

	public void setRecharge(long recharge) {
		this.recharge = recharge;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "paymentType")
	public short getPaymentType() {
		return paymentType;
	}

	public void setPaymentType(short paymentType) {
		this.paymentType = paymentType;
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

	@Column(name = "uniqueid")
	public String getUniqueid() {
		return uniqueid;
	}

	public void setUniqueid(String uniqueid) {
		this.uniqueid = uniqueid;
	}

	public void dtv(PaymentVO paymentVO) {

		BeanUtil.copyProperties(this, paymentVO, Arrays.asList("decoration", "customer", "collectUser", "confirmUser"));

		paymentVO.setCustomer(new CustomerVO());
		BeanUtil.copyProperties(this.getCustomer(), paymentVO.getCustomer());

		AdvanceReceiptPO advanceReceiptPO = this.getAdvanceReceipt();

		if (advanceReceiptPO != null) {
			BeanUtil.copyProperties(advanceReceiptPO, paymentVO, Arrays.asList("customer", "collectUser", "confirmUser", "status", "type"));

			paymentVO.setCollectUser(new UserBaseVO());
			BeanUtil.copyProperties(advanceReceiptPO.getCollecter(), paymentVO.getCollectUser(), Arrays.asList("dept", "duty"));

			if (advanceReceiptPO.getConfirmer() != null) {
				paymentVO.setConfirmUser(new UserBaseVO());
				BeanUtil.copyProperties(advanceReceiptPO.getConfirmer(), paymentVO.getConfirmUser(), Arrays.asList("dept", "duty"));
			}
		}

		if (this.getDecoration() != null) {

			DecorationPO decorationPO = this.getDecoration();

			paymentVO.setDecoration(new DecorationVO());

			decorationPO.ptvcascade(paymentVO.getDecoration());
		}
	}
}
