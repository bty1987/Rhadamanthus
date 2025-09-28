package com.fanglin.payment.po;

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

import com.fanglin.payment.vo.OalesPaymentVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.sales.po.OalesPO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "oalespayment", catalog = "payment")
public class OalesPaymentPO implements Serializable {

	private static final long serialVersionUID = -6488725711320678781L;

	public static final String COLUMN_OALES_ORDERID_STR = "oales.orderId";

	public static final String COLUMN_OALES_SID_STR = "oales.sid";

	public static final short STATUS_INITIAL_INT = 0;

	public static final short STATUS_PAIDFOR_INT = 1;

	public static final short STATUS_CONFIRMED_INT = 2;

	public static final short TYPE_PAYMENT_INT = 0;

	public static final short TYPE_REFUNDS_INT = 1;

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_OID_STR = "oid";

	public static final String COLUMN_ORID_STR = "orId";

	public static final String COLUMN_COLLECTTIME_STR = "oalesReceipt.collectTime";

	public static final String COLUMN_CONFIRMTIME_STR = "oalesReceipt.confirmTime";

	public static final String COLUMN_TYPE_STR = "type";

	public static final String COLUMN_ORDERID_STR = "orderId";

	private long opid;

	private long osid;

	private OalesReceiptPO oalesReceipt;

	private OalesPO oales;

	private String orderId;

	private short type;

	private short status;

	private String category;

	private String brand;

	private UserPO creater;

	private Timestamp createTime;

	private long referMoney;

	private int company;

	public OalesPaymentPO() {
		super();
	}

	public OalesPaymentPO(UserPO creater, OalesPO oales, OalesReceiptPO oalesReceipt) {
		super();
		this.creater = creater;
		this.oales = oales;
		this.oalesReceipt = oalesReceipt;
	}

	public OalesPaymentPO(UserPO creater, OalesPO oales) {
		super();
		this.creater = creater;
		this.oales = oales;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "opid")
	public long getOpid() {
		return opid;
	}

	public void setOpid(long opid) {
		this.opid = opid;
	}

	public long getOsid() {
		return osid;
	}

	public void setOsid(long osid) {
		this.osid = osid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "orid", referencedColumnName = "orid")
	public OalesReceiptPO getOalesReceipt() {
		return oalesReceipt;
	}

	public void setOalesReceipt(OalesReceiptPO oalesReceipt) {
		this.oalesReceipt = oalesReceipt;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "oid", referencedColumnName = "oid")
	public OalesPO getOales() {
		return oales;
	}

	public void setOales(OalesPO oales) {
		this.oales = oales;
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

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "category")
	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	@Column(name = "brand")
	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
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

	@Column(name = "referMoney")
	public long getReferMoney() {
		return referMoney;
	}

	public void setReferMoney(long referMoney) {
		this.referMoney = referMoney;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	public OalesPaymentVO ptv(OalesPaymentVO oalesPaymentVO) {

		BeanUtil.copyProperties(this, oalesPaymentVO, Arrays.asList("creater", "oales", "oalesReceipt"));

		if (oalesPaymentVO.getOalesReceipt() != null && getOalesReceipt() != null) {
			BeanUtil.copyProperties(getOalesReceipt(), oalesPaymentVO.getOalesReceipt(), Arrays.asList("collecter", "confirmer"));
		}

		if (oalesPaymentVO.getOalesReceipt() != null && oalesPaymentVO.getOalesReceipt().getCollecter() != null && getOalesReceipt() != null) {
			BeanUtil.copyProperties(getOalesReceipt().getCollecter(), oalesPaymentVO.getOalesReceipt().getCollecter(), Arrays.asList("role", "dept", "duty"));
		}

		if (oalesPaymentVO.getOalesReceipt() != null && oalesPaymentVO.getOalesReceipt().getConfirmer() != null && getOalesReceipt() != null) {
			BeanUtil.copyProperties(getOalesReceipt().getConfirmer(), oalesPaymentVO.getOalesReceipt().getConfirmer(), Arrays.asList("role", "dept", "duty"));
		}

		if (oalesPaymentVO.getCreater() != null) oalesPaymentVO.getCreater().setBaseInfo(getCreater());

		if (oalesPaymentVO.getOales() != null) getOales().ptv(oalesPaymentVO.getOales());

		return oalesPaymentVO;
	}
}
