/**
 * @File Name		: ProtationPO.java
 * @Package   	: com.fanglin.quotation.po
 * @Version		: 1.0
 * @Date			: 2021-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

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

import com.fanglin.data.po.QuotationVersionPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.quotation.vo.ProtationVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "protation", catalog = "quotation")
public class ProtationPO implements Serializable {

	private static final long serialVersionUID = 1504366793066108337L;

	public static final short DEFAULT_COMMON_INT = 0;

	public static final short DEFAULT_DEFAULT_INT = 1;

	public static final short STATUS_INIT_INT = 0;

	public static final short STATUS_LOCK_INT = 2;

	public static final short STATUS_APPROVE_INT = 3;

	private long pid;

	private long ppid;

	private String product;

	private String orderId;

	private String name;

	private Timestamp createTime;

	private UserPO creater;

	private QuotationVersionPO version;

	private long quotePrice;

	private int quoteArea;

	private long unitPrice;

	private long costPrice;

	private int profitRate;

	private long preferPrice;

	private long manageProfit;

	private long advanceProfit;

	private int manageRate;

	private String manageFormula;

	private int manageDiscount;

	private long managePrice;

	private int taxRate;

	private String taxFormula;

	private long taxPrice;

	private int discount;

	private long basicPrice;

	private long comdPrice;

	private long commPrice;

	private long adddPrice;

	private long addmPrice;

	private long subdPrice;

	private long submPrice;

	private long subcPrice;

	private long accdPrice;

	private long accmPrice;

	private int costRate;

	private int mostRate;

	private long mostPrice;

	private long totalCost;

	private long totalProfit;

	private long totalPrice;

	private short status;

	private short defaults;

	private String comment;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "pid")
	public long getPid() {
		return pid;
	}

	public void setPid(long pid) {
		this.pid = pid;
	}

	@Column(name = "ppid")
	public long getPpid() {
		return ppid;
	}

	public void setPpid(long ppid) {
		this.ppid = ppid;
	}

	@Column(name = "product")
	public String getProduct() {
		return product;
	}

	public void setProduct(String product) {
		this.product = product;
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

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "qvid", referencedColumnName = "qvId")
	public QuotationVersionPO getVersion() {
		return version;
	}

	public void setVersion(QuotationVersionPO version) {
		this.version = version;
	}

	@Column(name = "quotePrice")
	public long getQuotePrice() {
		return quotePrice;
	}

	public void setQuotePrice(long quotePrice) {
		this.quotePrice = quotePrice;
	}

	@Column(name = "quoteArea")
	public int getQuoteArea() {
		return quoteArea;
	}

	public void setQuoteArea(int quoteArea) {
		this.quoteArea = quoteArea;
	}

	@Column(name = "unitPrice")
	public long getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(long unitPrice) {
		this.unitPrice = unitPrice;
	}

	@Column(name = "costPrice")
	public long getCostPrice() {
		return costPrice;
	}

	public void setCostPrice(long costPrice) {
		this.costPrice = costPrice;
	}

	@Column(name = "profitRate")
	public int getProfitRate() {
		return profitRate;
	}

	public void setProfitRate(int profitRate) {
		this.profitRate = profitRate;
	}

	@Column(name = "basicPrice")
	public long getBasicPrice() {
		return basicPrice;
	}

	public void setBasicPrice(long basicPrice) {
		this.basicPrice = basicPrice;
	}

	@Column(name = "comdPrice")
	public long getComdPrice() {
		return comdPrice;
	}

	public void setComdPrice(long comdPrice) {
		this.comdPrice = comdPrice;
	}

	@Column(name = "commPrice")
	public long getCommPrice() {
		return commPrice;
	}

	public void setCommPrice(long commPrice) {
		this.commPrice = commPrice;
	}

	@Column(name = "adddPrice")
	public long getAdddPrice() {
		return adddPrice;
	}

	public void setAdddPrice(long adddPrice) {
		this.adddPrice = adddPrice;
	}

	@Column(name = "addmPrice")
	public long getAddmPrice() {
		return addmPrice;
	}

	public void setAddmPrice(long addmPrice) {
		this.addmPrice = addmPrice;
	}

	@Column(name = "subdPrice")
	public long getSubdPrice() {
		return subdPrice;
	}

	public void setSubdPrice(long subdPrice) {
		this.subdPrice = subdPrice;
	}

	@Column(name = "submPrice")
	public long getSubmPrice() {
		return submPrice;
	}

	public void setSubmPrice(long submPrice) {
		this.submPrice = submPrice;
	}

	@Column(name = "subcPrice")
	public long getSubcPrice() {
		return subcPrice;
	}

	public void setSubcPrice(long subcPrice) {
		this.subcPrice = subcPrice;
	}

	@Column(name = "preferPrice")
	public long getPreferPrice() {
		return preferPrice;
	}

	public void setPreferPrice(long preferPrice) {
		this.preferPrice = preferPrice;
	}

	@Column(name = "manageFormula")
	public String getManageFormula() {
		return manageFormula;
	}

	public void setManageFormula(String manageFormula) {
		this.manageFormula = manageFormula;
	}

	@Column(name = "manageDiscount")
	public int getManageDiscount() {
		return manageDiscount;
	}

	public void setManageDiscount(int manageDiscount) {
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

	@Column(name = "taxFormula")
	public String getTaxFormula() {
		return taxFormula;
	}

	public void setTaxFormula(String taxFormula) {
		this.taxFormula = taxFormula;
	}

	@Column(name = "taxPrice")
	public long getTaxPrice() {
		return taxPrice;
	}

	public void setTaxPrice(long taxPrice) {
		this.taxPrice = taxPrice;
	}

	@Column(name = "totalPrice")
	public long getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(long totalPrice) {
		this.totalPrice = totalPrice;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "defaults")
	public short getDefaults() {
		return defaults;
	}

	public void setDefaults(short defaults) {
		this.defaults = defaults;
	}

	@Column(name = "mostPrice")
	public long getMostPrice() {
		return mostPrice;
	}

	public void setMostPrice(long mostPrice) {
		this.mostPrice = mostPrice;
	}

	@Column(name = "costRate")
	public int getCostRate() {
		return costRate;
	}

	public void setCostRate(int costRate) {
		this.costRate = costRate;
	}

	@Column(name = "mostRate")
	public int getMostRate() {
		return mostRate;
	}

	public void setMostRate(int mostRate) {
		this.mostRate = mostRate;
	}

	@Column(name = "totalCost")
	public long getTotalCost() {
		return totalCost;
	}

	public void setTotalCost(long totalCost) {
		this.totalCost = totalCost;
	}

	@Column(name = "totalProfit")
	public long getTotalProfit() {
		return totalProfit;
	}

	public void setTotalProfit(long totalProfit) {
		this.totalProfit = totalProfit;
	}

	@Column(name = "accdPrice")
	public long getAccdPrice() {
		return accdPrice;
	}

	public void setAccdPrice(long accdPrice) {
		this.accdPrice = accdPrice;
	}

	@Column(name = "accmPrice")
	public long getAccmPrice() {
		return accmPrice;
	}

	public void setAccmPrice(long accmPrice) {
		this.accmPrice = accmPrice;
	}

	@Column(name = "discount")
	public int getDiscount() {
		return discount;
	}

	public void setDiscount(int discount) {
		this.discount = discount;
	}

	@Column(name = "manageRate")
	public int getManageRate() {
		return manageRate;
	}

	public void setManageRate(int manageRate) {
		this.manageRate = manageRate;
	}

	@Column(name = "manageProfit")
	public long getManageProfit() {
		return manageProfit;
	}

	public void setManageProfit(long manageProfit) {
		this.manageProfit = manageProfit;
	}

	@Column(name = "advanceProfit")
	public long getAdvanceProfit() {
		return advanceProfit;
	}

	public void setAdvanceProfit(long advanceProfit) {
		this.advanceProfit = advanceProfit;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public ProtationVO ptv(ProtationVO protationVO) {

		BeanUtil.copyPropertie(this, protationVO, Arrays.asList("creater", "version"));

		if (protationVO.getCreater() != null) BeanUtil.copyProperties(getCreater(), protationVO.getCreater(), Arrays.asList("duty", "dept", "role"));
		if (protationVO.getVersion() != null) BeanUtil.copyProperties(getVersion(), protationVO.getVersion());

		return protationVO;
	}

	public void convert(ProtationVO protationVO) {

		if (protationVO.getBasicPrice() != null) setBasicPrice(protationVO.getBasicPrice());
		if (protationVO.getComdPrice() != null) setComdPrice(protationVO.getComdPrice());
		if (protationVO.getCommPrice() != null) setCommPrice(protationVO.getCommPrice());
		if (protationVO.getAdddPrice() != null) setAdddPrice(protationVO.getAdddPrice());
		if (protationVO.getAddmPrice() != null) setAddmPrice(protationVO.getAddmPrice());
		if (protationVO.getSubdPrice() != null) setSubdPrice(protationVO.getSubdPrice());
		if (protationVO.getSubmPrice() != null) setSubmPrice(protationVO.getSubmPrice());
		if (protationVO.getSubcPrice() != null) setSubcPrice(protationVO.getSubcPrice());
		if (protationVO.getAccdPrice() != null) setAccdPrice(protationVO.getAccdPrice());
		if (protationVO.getAccmPrice() != null) setAccmPrice(protationVO.getAccmPrice());

		if (protationVO.getTotalPrice() != null) setTotalPrice(protationVO.getTotalPrice());
		if (protationVO.getTotalCost() != null) setTotalCost(protationVO.getTotalCost());
		if (protationVO.getManagePrice() != null) setManagePrice(protationVO.getManagePrice());
		if (protationVO.getTaxPrice() != null) setTaxPrice(protationVO.getTaxPrice());
		if (protationVO.getPreferPrice() != null) setPreferPrice(protationVO.getPreferPrice());
		if (protationVO.getManageProfit() != null) setManageProfit(protationVO.getManageProfit());
		if (protationVO.getAdvanceProfit() != null) setAdvanceProfit(protationVO.getAdvanceProfit());
	}

}