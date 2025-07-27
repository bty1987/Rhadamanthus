package com.fanglin.payment.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.payment.vo.AdvancePaymentVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "advancepayment", catalog = "payment")
public class AdvancePaymentPO implements java.io.Serializable {

	private static final long serialVersionUID = -3956125205251478439L;

	private int apId;

	private DecorationPO decoration;

	private long balance;

	private long projectBalance;

	private long materialBalance;

	private long zhenglinBalance;

	public AdvancePaymentPO() {
		super();
	}

	public AdvancePaymentPO(DecorationPO decoration) {
		super();
		this.decoration = decoration;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "apId")
	public int getApId() {
		return this.apId;
	}

	public void setApId(int apId) {
		this.apId = apId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "orderId", referencedColumnName = "orderId")
	public DecorationPO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationPO decoration) {
		this.decoration = decoration;
	}

	@Column(name = "balance")
	public long getBalance() {
		return this.balance;
	}

	public void setBalance(long balance) {
		this.balance = balance;
	}

	@Column(name = "projectBalance")
	public long getProjectBalance() {
		return this.projectBalance;
	}

	public void setProjectBalance(long projectBalance) {
		this.projectBalance = projectBalance;
	}

	@Column(name = "materialBalance")
	public long getMaterialBalance() {
		return this.materialBalance;
	}

	public void setMaterialBalance(long materialBalance) {
		this.materialBalance = materialBalance;
	}

	@Column(name = "zhenglinBalance")
	public long getZhenglinBalance() {
		return this.zhenglinBalance;
	}

	public void setZhenglinBalance(long zhenglinBalance) {
		this.zhenglinBalance = zhenglinBalance;
	}

	public AdvancePaymentVO ptv(AdvancePaymentVO advancePaymentVO) {

		BeanUtil.copyProperties(this, advancePaymentVO, Arrays.asList("decoration"));

		if (getDecoration() != null && advancePaymentVO.getDecoration() != null) getDecoration().ptvcascade(advancePaymentVO.getDecoration());

		return advancePaymentVO;
	}

}