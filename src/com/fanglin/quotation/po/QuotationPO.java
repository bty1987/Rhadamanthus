/**
 * @File Name		: QuotationVersionPO.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-7-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.po;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.data.po.QuotationVersionPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.quotation.vo.QuotationVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Entity
@Table(name = "quotation", catalog = "quotation")
public class QuotationPO implements Serializable {

	private static final long serialVersionUID = 3361405245563596740L;

	public static final short DEFAULTS_NONDEFAULT_INT = 0;

	public static final short DEFAULTS_DEFAULT_INT = 1;

	public static final short STATUS_INIT_INT = 0;

	public static final short STATUS_LOCK_INT = 1;

	public static final short STATUS_APPROVE_INT = 2;
	
	public static final short ATTSTATUS_AUDI_INT = 2;
	
	public static final short ATTSTATUS_FINISH_INT = 3;

	public static final short KEEPRICE_LATEST_INT = 0;

	public static final short KEEPRICE_TIMEKEEP_INT = 1;

	public static final short KEEPRICE_PRICEKEEP_INT = 2;

	public static final short KEEPRICE_ALLKEEP_INT = 3;

	private long qid;

	private String orderId;

	private String name;

	private String style;

	private Timestamp createTime;

	private Timestamp updateTime;

	private Timestamp lockTime;

	private int workTime;

	private int audiTime;

	private UserPO creater;

	private QuotationVersionPO version;

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

	private long consPrice;

	private long comsPrice;

	private long undisComPrice;

	private long disComPrice;

	private long totalPrice;

	private short defaults;

	private short status;

	private short attstatus;

	private String content;

	private short index;

	public QuotationPO() {
		super();
	}

	public QuotationPO(long qid) {
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

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
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

	@Column(name = "updateTime")
	public Timestamp getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Timestamp updateTime) {
		this.updateTime = updateTime;
	}

	@Column(name = "lockTime")
	public Timestamp getLockTime() {
		return lockTime;
	}

	public void setLockTime(Timestamp lockTime) {
		this.lockTime = lockTime;
	}

	@Column(name = "workTime")
	public int getWorkTime() {
		return workTime;
	}

	public void setWorkTime(int workTime) {
		this.workTime = workTime;
	}

	@Column(name = "audiTime")
	public int getAudiTime() {
		return audiTime;
	}

	public void setAudiTime(int audiTime) {
		this.audiTime = audiTime;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "qvid", referencedColumnName = "qvId")
	public QuotationVersionPO getVersion() {
		return version;
	}

	public void setVersion(QuotationVersionPO version) {
		this.version = version;
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

	@Column(name = "undisComPrice")
	public long getUndisComPrice() {
		return undisComPrice;
	}

	public void setUndisComPrice(long undisComPrice) {
		this.undisComPrice = undisComPrice;
	}

	@Column(name = "disComPrice")
	public long getDisComPrice() {
		return disComPrice;
	}

	public void setDisComPrice(long disComPrice) {
		this.disComPrice = disComPrice;
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

	@Column(name = "attstatus")
	public short getAttstatus() {
		return attstatus;
	}

	public void setAttstatus(short attstatus) {
		this.attstatus = attstatus;
	}

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Column(name = "[index]")
	public short getIndex() {
		return index;
	}

	public void setIndex(short index) {
		this.index = index;
	}

	public void ptp(String orderId, UserPO userPO, String name, String style, Timestamp updateTime) {

		this.setOrderId(orderId);
		this.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		this.setUpdateTime(updateTime);
		this.setCreater(userPO);
		this.setName(name);
		this.setStyle(style);
		this.setDiscount(10000);
		this.setTotalPrice(0L);

		this.setContent("");
	}

	public QuotationVO ptv(QuotationVO quotationVO) {

		BeanUtil.copyProperties(this, quotationVO, Arrays.asList("creater", "version"));

		if (quotationVO.getVersion() != null) BeanUtil.copyProperties(getVersion(), quotationVO.getVersion());
		if (quotationVO.getCreater() != null) BeanUtil.copyProperties(getCreater(), quotationVO.getCreater(), Arrays.asList("duty", "dept", "role"));

		return quotationVO;
	}
}
