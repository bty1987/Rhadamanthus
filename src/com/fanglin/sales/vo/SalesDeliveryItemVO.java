package com.fanglin.sales.vo;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.core.vo.Filter;
import com.fanglin.personel.vo.UserBaseVO;

public class SalesDeliveryItemVO implements Serializable {

	private static final long serialVersionUID = 3179998768380258300L;

	private Long sdiid;

	private SalesVO sales;

	private SalesItemVO salesItem;

	private Short status;

	private Timestamp createTime;

	private Timestamp tranTime;

	private Timestamp checkTime;

	private Timestamp confirmTime;

	private Timestamp finishTime;

	private UserBaseVO traner;

	private UserBaseVO checker;

	private UserBaseVO confirmer;

	private UserBaseVO finisher;

	private String comment;

	private Integer company;

	public SalesDeliveryItemVO() {
		super();
	}

	public SalesDeliveryItemVO(Long sdiid, SalesVO sales, SalesItemVO salesItem, Short status, Timestamp createTime, Timestamp tranTime, Timestamp checkTime, Timestamp confirmTime, Timestamp finishTime, UserBaseVO traner, UserBaseVO checker, UserBaseVO confirmer, UserBaseVO finisher, String comment, Integer company) {
		super();
		this.sdiid = sdiid;
		this.sales = sales;
		this.salesItem = salesItem;
		this.status = status;
		this.createTime = createTime;
		this.tranTime = tranTime;
		this.checkTime = checkTime;
		this.confirmTime = confirmTime;
		this.finishTime = finishTime;
		this.traner = traner;
		this.checker = checker;
		this.confirmer = confirmer;
		this.finisher = finisher;
		this.comment = comment;
		this.company = company;
	}

	public SalesDeliveryItemVO(SalesVO sales, SalesItemVO salesItem, UserBaseVO traner, UserBaseVO checker, UserBaseVO confirmer, UserBaseVO finisher, UserBaseVO balancer) {
		super();
		this.sales = sales;
		this.salesItem = salesItem;
		this.traner = traner;
		this.checker = checker;
		this.confirmer = confirmer;
		this.finisher = finisher;
	}

	public Long getSdiid() {
		return sdiid;
	}

	public void setSdiid(Long sdiid) {
		this.sdiid = sdiid;
	}

	public SalesVO getSales() {
		return sales;
	}

	public void setSales(SalesVO sales) {
		this.sales = sales;
	}

	public SalesItemVO getSalesItem() {
		return salesItem;
	}

	public void setSalesItem(SalesItemVO salesItem) {
		this.salesItem = salesItem;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getTranTime() {
		return tranTime;
	}

	public void setTranTime(Timestamp tranTime) {
		this.tranTime = tranTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCheckTime() {
		return checkTime;
	}

	public void setCheckTime(Timestamp checkTime) {
		this.checkTime = checkTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getConfirmTime() {
		return confirmTime;
	}

	public void setConfirmTime(Timestamp confirmTime) {
		this.confirmTime = confirmTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}

	public UserBaseVO getTraner() {
		return traner;
	}

	public void setTraner(UserBaseVO traner) {
		this.traner = traner;
	}

	public UserBaseVO getChecker() {
		return checker;
	}

	public void setChecker(UserBaseVO checker) {
		this.checker = checker;
	}

	public UserBaseVO getConfirmer() {
		return confirmer;
	}

	public void setConfirmer(UserBaseVO confirmer) {
		this.confirmer = confirmer;
	}

	public UserBaseVO getFinisher() {
		return finisher;
	}

	public void setFinisher(UserBaseVO finisher) {
		this.finisher = finisher;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public SalesDeliveryItemVO filter(List<Filter> filters) {

		if (getStatus() != null) {
			filters.add(new Filter("status", String.valueOf(getStatus()), "eq"));
		}

		return this;
	}

}
