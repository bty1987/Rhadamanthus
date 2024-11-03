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

package com.fanglin.quotation.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.data.quotation.vo.QuotationVersionVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.vo.UserBaseVO;

public class ProtationVO implements Serializable {

	private static final long serialVersionUID = 3783839894798170014L;

	private Long pid;

	private Long ppid;

	private String product;

	private String orderId;

	private DecorationVO decoration;

	private String name;

	private Timestamp createTime;

	private UserBaseVO creater;

	private QuotationVersionVO version;

	private Long quotePrice;

	private Integer quoteArea;

	private Long unitPrice;

	private Long costPrice;

	private Integer profitRate;

	private Long preferPrice;

	private Long manageProfit;

	private Long advanceProfit;

	private Integer manageRate;

	private String manageFormula;

	private Long managePrice;

	private Integer taxRate;

	private String taxFormula;

	private Long taxPrice;

	private Integer discount;

	private Long basicPrice;

	private Long comdPrice;

	private Long commPrice;

	private Long adddPrice;

	private Long addmPrice;

	private Long subdPrice;

	private Long submPrice;

	private Long subcPrice;

	private Long accdPrice;

	private Long accmPrice;

	private Integer costRate;

	private Integer mostRate;

	private Long mostPrice;

	private Long totalCost;

	private Long totalProfit;

	private Long totalPrice;

	private Short status;

	private Short defaults;

	private String comment;

	public ProtationVO() {
		super();
	}

	public ProtationVO(DecorationVO decoration, UserBaseVO creater, QuotationVersionVO version) {
		super();
		this.decoration = decoration;
		this.creater = creater;
		this.version = version;

	}

	public Long getPid() {
		return pid;
	}

	public void setPid(Long pid) {
		this.pid = pid;
	}

	public Long getPpid() {
		return ppid;
	}

	public void setPpid(Long ppid) {
		this.ppid = ppid;
	}

	public String getProduct() {
		return product;
	}

	public void setProduct(String product) {
		this.product = product;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	public QuotationVersionVO getVersion() {
		return version;
	}

	public void setVersion(QuotationVersionVO version) {
		this.version = version;
	}

	public Long getQuotePrice() {
		return quotePrice;
	}

	public void setQuotePrice(Long quotePrice) {
		this.quotePrice = quotePrice;
	}

	public Integer getQuoteArea() {
		return quoteArea;
	}

	public void setQuoteArea(Integer quoteArea) {
		this.quoteArea = quoteArea;
	}

	public Long getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(Long unitPrice) {
		this.unitPrice = unitPrice;
	}

	public Long getCostPrice() {
		return costPrice;
	}

	public void setCostPrice(Long costPrice) {
		this.costPrice = costPrice;
	}

	public Integer getProfitRate() {
		return profitRate;
	}

	public void setProfitRate(Integer profitRate) {
		this.profitRate = profitRate;
	}

	public Long getBasicPrice() {
		return basicPrice;
	}

	public void setBasicPrice(Long basicPrice) {
		this.basicPrice = basicPrice;
	}

	public Long getComdPrice() {
		return comdPrice;
	}

	public void setComdPrice(Long comdPrice) {
		this.comdPrice = comdPrice;
	}

	public Long getCommPrice() {
		return commPrice;
	}

	public void setCommPrice(Long commPrice) {
		this.commPrice = commPrice;
	}

	public Long getAdddPrice() {
		return adddPrice;
	}

	public void setAdddPrice(Long adddPrice) {
		this.adddPrice = adddPrice;
	}

	public Long getAddmPrice() {
		return addmPrice;
	}

	public void setAddmPrice(Long addmPrice) {
		this.addmPrice = addmPrice;
	}

	public Long getSubdPrice() {
		return subdPrice;
	}

	public void setSubdPrice(Long subdPrice) {
		this.subdPrice = subdPrice;
	}

	public Long getSubmPrice() {
		return submPrice;
	}

	public void setSubmPrice(Long submPrice) {
		this.submPrice = submPrice;
	}

	public Long getSubcPrice() {
		return subcPrice;
	}

	public void setSubcPrice(Long subcPrice) {
		this.subcPrice = subcPrice;
	}

	public Long getPreferPrice() {
		return preferPrice;
	}

	public void setPreferPrice(Long preferPrice) {
		this.preferPrice = preferPrice;
	}

	public String getManageFormula() {
		return manageFormula;
	}

	public void setManageFormula(String manageFormula) {
		this.manageFormula = manageFormula;
	}

	public Long getManagePrice() {
		return managePrice;
	}

	public void setManagePrice(Long managePrice) {
		this.managePrice = managePrice;
	}

	public Integer getTaxRate() {
		return taxRate;
	}

	public void setTaxRate(Integer taxRate) {
		this.taxRate = taxRate;
	}

	public String getTaxFormula() {
		return taxFormula;
	}

	public void setTaxFormula(String taxFormula) {
		this.taxFormula = taxFormula;
	}

	public Long getTaxPrice() {
		return taxPrice;
	}

	public void setTaxPrice(Long taxPrice) {
		this.taxPrice = taxPrice;
	}

	public Long getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(Long totalPrice) {
		this.totalPrice = totalPrice;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Short getDefaults() {
		return defaults;
	}

	public void setDefaults(Short defaults) {
		this.defaults = defaults;
	}

	public Long getMostPrice() {
		return mostPrice;
	}

	public void setMostPrice(Long mostPrice) {
		this.mostPrice = mostPrice;
	}

	public Integer getCostRate() {
		return costRate;
	}

	public void setCostRate(Integer costRate) {
		this.costRate = costRate;
	}

	public Integer getMostRate() {
		return mostRate;
	}

	public void setMostRate(Integer mostRate) {
		this.mostRate = mostRate;
	}

	public Long getTotalCost() {
		return totalCost;
	}

	public void setTotalCost(Long totalCost) {
		this.totalCost = totalCost;
	}

	public Long getTotalProfit() {
		return totalProfit;
	}

	public void setTotalProfit(Long totalProfit) {
		this.totalProfit = totalProfit;
	}

	public Long getAccdPrice() {
		return accdPrice;
	}

	public void setAccdPrice(Long accdPrice) {
		this.accdPrice = accdPrice;
	}

	public Long getAccmPrice() {
		return accmPrice;
	}

	public void setAccmPrice(Long accmPrice) {
		this.accmPrice = accmPrice;
	}

	public Integer getDiscount() {
		return discount;
	}

	public void setDiscount(Integer discount) {
		this.discount = discount;
	}

	public Integer getManageRate() {
		return manageRate;
	}

	public void setManageRate(Integer manageRate) {
		this.manageRate = manageRate;
	}

	public Long getManageProfit() {
		return manageProfit;
	}

	public void setManageProfit(Long manageProfit) {
		this.manageProfit = manageProfit;
	}

	public Long getAdvanceProfit() {
		return advanceProfit;
	}

	public void setAdvanceProfit(Long advanceProfit) {
		this.advanceProfit = advanceProfit;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
