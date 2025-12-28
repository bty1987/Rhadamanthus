package com.fanglin.quotation.po;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;
import com.fanglin.quotation.vo.ExtensionVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "extension", catalog = "quotation")
public class ExtensionPO implements Serializable {

	private static final long serialVersionUID = -3842029738524298580L;

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final String COLUMN_TYPE_STR = "type";

	public static final short STATUS_INIT_SHORT = 0;

	public static final short STATUS_LOCK_INT = 1;

	public static final short TYPE_ADD_INT = 0;

	public static final short TYPE_SUB_INT = 1;

	public static final short ATTTYPE_COMMON_INT = 0;

	public static final short ATTTYPE_MET_INT = 1;

	public static final short ATTTYPE_QUOTATION_INT = 3;

	public static final short ATTTYPE_ACTIVITY_INT = 4;

	public static final short MANAGE_DISCOUNT_NONE_INT = 0;

	public static final short MANAGE_DISCOUNT_MANAGE_INT = 1;

	private long eid;

	private String orderId;

	private long qid;

	private short type;

	private short atttype;

	private long undisPrice;

	private long disPrice;

	private long manageRate;

	private short manageDiscount;

	private long managePrice;

	private int taxRate;

	private long taxPrice;

	private long consPrice;

	private long comsPrice;

	private long total;

	private short status;

	private UserPO creater;

	private Timestamp createTime;

	private String content;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "eid")
	public long getEid() {
		return eid;
	}

	public void setEid(long eid) {
		this.eid = eid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "qid")
	public long getQid() {
		return qid;
	}

	public void setQid(long qid) {
		this.qid = qid;
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

	@Column(name = "manageRate")
	public long getManageRate() {
		return manageRate;
	}

	public void setManageRate(long manageRate) {
		this.manageRate = manageRate;
	}

	@Column(name = "manageDiscount")
	public short getManageDiscount() {
		return manageDiscount;
	}

	public void setManageDiscount(short manageDiscount) {
		this.manageDiscount = manageDiscount;
	}

	@Column(name = "managePrice")
	public long getManagePrice() {
		return managePrice;
	}

	public void setManagePrice(long managePrice) {
		this.managePrice = managePrice;
	}

	@Column(name = "taxRate")
	public int getTaxRate() {
		return taxRate;
	}

	public void setTaxRate(int taxRate) {
		this.taxRate = taxRate;
	}

	@Column(name = "taxPrice")
	public long getTaxPrice() {
		return taxPrice;
	}

	public void setTaxPrice(long taxPrice) {
		this.taxPrice = taxPrice;
	}

	@Column(name = "consPrice")
	public long getConsPrice() {
		return consPrice;
	}

	public void setConsPrice(long consPrice) {
		this.consPrice = consPrice;
	}

	@Column(name = "comsPrice")
	public long getComsPrice() {
		return comsPrice;
	}

	public void setComsPrice(long comsPrice) {
		this.comsPrice = comsPrice;
	}

	@Column(name = "total")
	public long getTotal() {
		return total;
	}

	public void setTotal(long total) {
		this.total = total;
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

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	public ExtensionVO advance(ExtensionVO extensionVO) {

		setUndisPrice(extensionVO.getUndisPrice());
		setDisPrice(extensionVO.getDisPrice());
		setManageRate(extensionVO.getManageRate());
		setManagePrice(extensionVO.getManagePrice());
		setManageDiscount(extensionVO.getManageDiscount());
		setTaxRate(extensionVO.getTaxRate());
		setTaxPrice(extensionVO.getTaxPrice());
		setTotal(extensionVO.getTotal());
		setConsPrice(extensionVO.getConsPrice());
		setComsPrice(extensionVO.getComsPrice());

		return extensionVO;
	}

	public ExtensionVO ptv(ExtensionVO extensionVO) {

		BeanUtil.copyPropertie(this, extensionVO, Arrays.asList("creater"));

		if (extensionVO.getCreater() != null && getCreater() != null) extensionVO.getCreater().setBaseInfo(getCreater());

		return extensionVO;
	}

}
