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

import com.fanglin.personel.po.UserPO;

public class ProtationVO implements Serializable {

	private static final long serialVersionUID = -3071996221463110945L;

	private Long pid;

	private Long ppid;

	private String orderId;

	private String name;

	private Timestamp createTime;

	private UserPO creater;

	private Long quotePrice;

	private Integer quoteArea;

	private Long unitPrice;

	private Long costPrice;

	private Integer profitRate;

	private Long basicPrice;

	private Long comdPrice;

	private Long commPrice;

	private Long adddPrice;

	private Long addmPrice;

	private Long subdPrice;

	private Long submPrice;

	private Long preferPrice;

	private Long managePrice;

	private Long totalPrice;

	private Short status;

	private Short defaults;

	private Long mostPrice;

	private Integer costRate;

	private Integer mostRate;

	private Long totalCost;

	private Long totalProfit;

	private String comment;

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

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
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

	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
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

	public Long getPreferPrice() {
		return preferPrice;
	}

	public void setPreferPrice(Long preferPrice) {
		this.preferPrice = preferPrice;
	}

	public Long getManagePrice() {
		return managePrice;
	}

	public void setManagePrice(Long managePrice) {
		this.managePrice = managePrice;
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

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
