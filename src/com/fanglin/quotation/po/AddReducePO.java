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
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "addreduce", catalog = "quotation")
public class AddReducePO implements Serializable {

	private static final long serialVersionUID = -46470961633886019L;

	public static final String COLUMN_ARID_STR = "arId";

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final String COLUMN_TYPE_STR = "type";

	public static final String COLUMN_PAYTYPE_STR = "paytype";

	public static final String COLUMN_TOTAL_STR = "total";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_ISAFFIRM_STR = "isAffirm";

	public static final String COLUMN_CONTENT_STR = "content";

	public static final String COLUMN_DPID_STR = "dpId";

	public static final int TYPE_ADD_INT = 0;

	public static final int TYPE_REDUCE_INT = 1;

	public static final int TYPE_LEAKAGE_INT = 2;

	public static final short PAYTYPE_PAY_INT = 0;

	public static final short PAYTYPE_COM_INT = 1;

	public static final short PAYTYPE_ARO_INT = 2;

	public static final short STATUS_UNSUBMIT_INT = 0;

	public static final short STATUS_SUBMIT_INT = 1;

	public static final short STATUS_PAYED_INT = 2;

	public static final short STATUS_CONFIRMED_INT = 3;

	public static final short ISAFFIRM_UNSUBMIT_INT = 0;

	public final short ISAFFIRM_CONFIRMED_INT = 1;

	private long arId;

	private long dpId;

	private String orderId;

	private short type;

	private short paytype;

	private long undisPrice;

	private long disPrice;

	private long uncalPrice;

	private long calPrice;

	private long managePrice;

	private int manageRate;

	private long total;

	private int discount;

	private short status;

	private short isAffirm;

	private Timestamp createTime;

	private String content;

	@Id
	@Column(name = "arId")
	public long getArId() {
		return arId;
	}

	public void setArId(long arId) {
		this.arId = arId;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
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

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
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

	@Column(name = "isAffirm")
	public short getIsAffirm() {
		return isAffirm;
	}

	public void setIsAffirm(short isAffirm) {
		this.isAffirm = isAffirm;
	}

}
