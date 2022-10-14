package com.fanglin.quotation.po;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.DateUtil;

@Entity
@Table(name = "quotation", catalog = "quotation")
public class QuotationDO implements Serializable {

	private static final long serialVersionUID = 7182526824774377499L;
	public static final short DEFAULTS_NONDEFAULT_INT = 0;

	public static final short DEFAULTS_DEFAULT_INT = 1;

	public static final short STATUS_LOCK_INT = 1;

	public static final short STATUS_INIT_INT = 0;

	private long qid;

	private DecorationPO decoration;

	private String name;

	private String style;

	private Timestamp createTime;

	private UserPO creater;

	private long basePrice;

	private long undisPrice;

	private long disPrice;

	private int discount;

	private long managePrice;

	private int manageRate;

	private short manageDiscount;

	private long trafficPrice;

	private int trafficRate;

	private short trafficDiscount;

	private long taxPrice;

	private int taxRate;

	private short taxDiscount;

	private long unachePrice;

	private long costPrice;

	private long totalPrice;

	private short defaults;

	private short status;

	private String content;

	public QuotationDO() {
		super();
	}

	public QuotationDO(long qid) {
		this.qid = qid;
	}

	@Id
	@GeneratedValue
	@Column(name = "qid")
	public long getQid() {
		return qid;
	}

	public void setQid(long qid) {
		this.qid = qid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "orderId", referencedColumnName = "orderId")
	public DecorationPO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationPO decoration) {
		this.decoration = decoration;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "style")
	public String getStyle() {
		return style;
	}

	public void setStyle(String style) {
		this.style = style;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@Column(name = "basePrice")
	public long getBasePrice() {
		return basePrice;
	}

	public void setBasePrice(long basePrice) {
		this.basePrice = basePrice;
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

	@Column(name = "discount")
	public int getDiscount() {
		return discount;
	}

	public void setDiscount(int discount) {
		this.discount = discount;
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

	@Column(name = "trafficPrice")
	public long getTrafficPrice() {
		return trafficPrice;
	}

	public void setTrafficPrice(long trafficPrice) {
		this.trafficPrice = trafficPrice;
	}

	@Column(name = "trafficRate")
	public int getTrafficRate() {
		return trafficRate;
	}

	public void setTrafficRate(int trafficRate) {
		this.trafficRate = trafficRate;
	}

	@Column(name = "trafficDiscount")
	public short getTrafficDiscount() {
		return trafficDiscount;
	}

	public void setTrafficDiscount(short trafficDiscount) {
		this.trafficDiscount = trafficDiscount;
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

	@Column(name = "unachePrice")
	public long getUnachePrice() {
		return unachePrice;
	}

	public void setUnachePrice(long unachePrice) {
		this.unachePrice = unachePrice;
	}

	@Column(name = "costPrice")
	public long getCostPrice() {
		return costPrice;
	}

	public void setCostPrice(long costPrice) {
		this.costPrice = costPrice;
	}

	@Column(name = "totalPrice")
	public long getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(long totalPrice) {
		this.totalPrice = totalPrice;
	}

	@Column(name = "defaults")
	public short getDefaults() {
		return defaults;
	}

	public void setDefaults(short defaults) {
		this.defaults = defaults;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public void ptp(String orderId, UserPO userPO, String name, String style) {

		this.setDecoration(decoration);
		this.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		this.setCreater(userPO);
		this.setName(name);
		this.setStyle(style);
		this.setDiscount(10000);
		this.setTotalPrice(0L);

		this.setDefaults(QuotationPO.DEFAULTS_DEFAULT_INT); // 设置复制报价为默认报价

		this.setContent("");
	}

}
