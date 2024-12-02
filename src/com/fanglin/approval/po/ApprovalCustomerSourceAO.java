package com.fanglin.approval.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

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
import com.fanglin.customer.po.CustomerChancePO;
import com.fanglin.customer.po.CustomerSourcePO;
import com.fanglin.data.po.DecorationBusitypePO;

@Entity
@Table(name = "approvalCustomerSource", catalog = "approval")
public class ApprovalCustomerSourceAO implements Serializable {

	private static final long serialVersionUID = -5371631778519685511L;

	private long acsid;

	private ApprovalPO approval;

	private CustomerSourcePO customerSource;

	private CustomerChancePO customerChance;

	private CustomerPO customer;

	private HousePO house;

	private DecorationBusitypePO decorationBusitype;

	private int rate;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "acsid")
	public long getAcsid() {
		return acsid;
	}

	public void setAcsid(long acsid) {
		this.acsid = acsid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "aid", referencedColumnName = "aid")
	public ApprovalPO getApproval() {
		return approval;
	}

	public void setApproval(ApprovalPO approval) {
		this.approval = approval;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "csid", referencedColumnName = "csid")
	public CustomerSourcePO getCustomerSource() {
		return customerSource;
	}

	public void setCustomerSource(CustomerSourcePO customerSource) {
		this.customerSource = customerSource;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ccid", referencedColumnName = "ccid")
	public CustomerChancePO getCustomerChance() {
		return customerChance;
	}

	public void setCustomerChance(CustomerChancePO customerChance) {
		this.customerChance = customerChance;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cid", referencedColumnName = "cid")
	public CustomerPO getCustomer() {
		return customer;
	}

	public void setCustomer(CustomerPO customer) {
		this.customer = customer;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "hid", referencedColumnName = "hid")
	public HousePO getHouse() {
		return house;
	}

	public void setHouse(HousePO house) {
		this.house = house;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "dbid", referencedColumnName = "dbid")
	public DecorationBusitypePO getDecorationBusitype() {
		return decorationBusitype;
	}

	public void setDecorationBusitype(DecorationBusitypePO decorationBusitype) {
		this.decorationBusitype = decorationBusitype;
	}

	@Column(name = "rate")
	public int getRate() {
		return rate;
	}

	public void setRate(int rate) {
		this.rate = rate;
	}

}
