/**
 * @File Name		: AddReducePO.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-9-22
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "addreduce", catalog = "quotation")
public class AddReduceDO implements Serializable {

	private static final long serialVersionUID = 5967544521646878359L;

	public static final String COLUMN_ARID_STR = "arId";

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final String COLUMN_TYPE_STR = "type";

	public static final String COLUMN_PAYTYPE_STR = "paytype";

	public static final String COLUMN_TOTAL_STR = "total";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_CONTENT_STR = "content";

	public static final String COLUMN_DPID_STR = "dpId";

	public static final int TYPE_ADD_INT = 0;

	public static final int TYPE_REDUCE_INT = 1;

	public static final int TYPE_LEAKAGE_INT = 2;

	public static final int STATUS_UNSUBMIT_INT = 0;

	public static final int STATUS_SUBMIT_INT = 1;

	public static final int STATUS_PAYED_INT = 2;

	public static final int STATUS_CONFIRMED_INT = 3;

	private long arId;

	private long dpId;

	private DecorationPO decoration;

	private ConstructionNodePO constructionNode;

	private short type;

	private short atttype;

	private short paytype;

	private long undisPrice;

	private long disPrice;

	private long uncalPrice;

	private long calPrice;

	private long managePrice;

	private int manageRate;

	private short manageDiscount;

	private long taxPrice;

	private int taxRate;

	private short taxDiscount;

	private int accountDiscount;

	private long consPrice;

	private long total;

	private int discount;

	private short schedule;

	private short status;

	private short isAffirm;

	private UserPO creater;

	private Timestamp createTime;

	private Timestamp confirmTime;

	private Timestamp sendTime;

	private Timestamp affirmTime;

	private String content;

	@Id
	@Column(name = "arId")
	public long getArId() {
		return arId;
	}

	public void setArId(long arId) {
		this.arId = arId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "orderId", referencedColumnName = "orderId")
	public DecorationPO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationPO decoration) {
		this.decoration = decoration;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cnid", referencedColumnName = "cnid")
	public ConstructionNodePO getConstructionNode() {
		return constructionNode;
	}

	public void setConstructionNode(ConstructionNodePO constructionNode) {
		this.constructionNode = constructionNode;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "atttype")
	public short getAtttype() {
		return atttype;
	}

	public void setAtttype(short atttype) {
		this.atttype = atttype;
	}

	@Column(name = "paytype")
	public short getPaytype() {
		return paytype;
	}

	public void setPaytype(short paytype) {
		this.paytype = paytype;
	}

	@Column(name = "total")
	public long getTotal() {
		return total;
	}

	public void setTotal(long total) {
		this.total = total;
	}

	@Column(name = "undisPrice")
	public long getUndisPrice() {
		return undisPrice;
	}

	public void setUndisPrice(long undisPrice) {
		this.undisPrice = undisPrice;
	}

	@Column(name = "disPrice")
	public long getDisPrice() {
		return disPrice;
	}

	public void setDisPrice(long disPrice) {
		this.disPrice = disPrice;
	}

	@Column(name = "uncalPrice")
	public long getUncalPrice() {
		return uncalPrice;
	}

	public void setUncalPrice(long uncalPrice) {
		this.uncalPrice = uncalPrice;
	}

	@Column(name = "calPrice")
	public long getCalPrice() {
		return calPrice;
	}

	public void setCalPrice(long calPrice) {
		this.calPrice = calPrice;
	}

	@Column(name = "discount")
	public int getDiscount() {
		return discount;
	}

	public void setDiscount(int discount) {
		this.discount = discount;
	}

	@Column(name = "consPrice")
	public long getConsPrice() {
		return consPrice;
	}

	public void setConsPrice(long consPrice) {
		this.consPrice = consPrice;
	}

	@Column(name = "schedule")
	public short getSchedule() {
		return schedule;
	}

	public void setSchedule(short schedule) {
		this.schedule = schedule;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "isAffirm")
	public short getIsAffirm() {
		return isAffirm;
	}

	public void setIsAffirm(short isAffirm) {
		this.isAffirm = isAffirm;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Column(name = "dpId")
	public long getDpId() {
		return dpId;
	}

	public void setDpId(long dpId) {
		this.dpId = dpId;
	}

	@Column(name = "managePrice")
	public long getManagePrice() {
		return managePrice;
	}

	public void setManagePrice(long managePrice) {
		this.managePrice = managePrice;
	}

	@Column(name = "manageRate")
	public int getManageRate() {
		return manageRate;
	}

	public void setManageRate(int manageRate) {
		this.manageRate = manageRate;
	}

	@Column(name = "manageDiscount")
	public short getManageDiscount() {
		return manageDiscount;
	}

	public void setManageDiscount(short manageDiscount) {
		this.manageDiscount = manageDiscount;
	}

	@Column(name = "taxPrice")
	public long getTaxPrice() {
		return taxPrice;
	}

	public void setTaxPrice(long taxPrice) {
		this.taxPrice = taxPrice;
	}

	@Column(name = "taxRate")
	public int getTaxRate() {
		return taxRate;
	}

	public void setTaxRate(int taxRate) {
		this.taxRate = taxRate;
	}

	@Column(name = "taxDiscount")
	public short getTaxDiscount() {
		return taxDiscount;
	}

	public void setTaxDiscount(short taxDiscount) {
		this.taxDiscount = taxDiscount;
	}

	@Column(name = "accountDiscount")
	public int getAccountDiscount() {
		return accountDiscount;
	}

	public void setAccountDiscount(int accountDiscount) {
		this.accountDiscount = accountDiscount;
	}

	@Column(name = "confirmTime")
	public Timestamp getConfirmTime() {
		return confirmTime;
	}

	public void setConfirmTime(Timestamp confirmTime) {
		this.confirmTime = confirmTime;
	}

	@Column(name = "sendTime")
	public Timestamp getSendTime() {
		return sendTime;
	}

	public void setSendTime(Timestamp sendTime) {
		this.sendTime = sendTime;
	}

	@Column(name = "affirmTime")
	public Timestamp getAffirmTime() {
		return affirmTime;
	}

	public void setAffirmTime(Timestamp affirmTime) {
		this.affirmTime = affirmTime;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}
}
