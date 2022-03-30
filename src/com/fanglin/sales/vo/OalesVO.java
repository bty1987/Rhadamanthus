package com.fanglin.sales.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.vo.UserBaseVO;

public class OalesVO implements Serializable {

	private static final long serialVersionUID = 4670414648036703526L;

	private Long oid;

	private String no;

	private DecorationVO decoration;

	private HouseVO house;

	private CustomerVO customer;

	private UserBaseVO supplier;

	private Long bid;

	private String category;

	private String brand;

	private Short atttype;

	private Short awardType;

	private UserBaseVO creater;

	private UserBaseVO servicer;

	private Timestamp createTime;

	private Long total;

	private Long profit;

	private Long award;

	private Short status;

	private String comment;

	private Integer company;

	public OalesVO() {
		super();
	}

	public OalesVO(DecorationVO decoration, UserBaseVO creater, UserBaseVO supplier, UserBaseVO servicer) {

		super();

		this.decoration = decoration;
		this.creater = creater;
		this.supplier = supplier;
		this.servicer = servicer;
	}

	public Long getOid() {
		return oid;
	}

	public void setOid(Long oid) {
		this.oid = oid;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public UserBaseVO getSupplier() {
		return supplier;
	}

	public void setSupplier(UserBaseVO supplier) {
		this.supplier = supplier;
	}

	public HouseVO getHouse() {
		return house;
	}

	public void setHouse(HouseVO house) {
		this.house = house;
	}

	public CustomerVO getCustomer() {
		return customer;
	}

	public void setCustomer(CustomerVO customer) {
		this.customer = customer;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public Long getBid() {
		return bid;
	}

	public void setBid(Long bid) {
		this.bid = bid;
	}

	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	public Short getAtttype() {
		return atttype;
	}

	public void setAtttype(Short atttype) {
		this.atttype = atttype;
	}

	public Short getAwardType() {
		return awardType;
	}

	public void setAwardType(Short awardType) {
		this.awardType = awardType;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	public UserBaseVO getServicer() {
		return servicer;
	}

	public void setServicer(UserBaseVO servicer) {
		this.servicer = servicer;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Long getTotal() {
		return total;
	}

	public void setTotal(Long total) {
		this.total = total;
	}

	public Long getProfit() {
		return profit;
	}

	public void setProfit(Long profit) {
		this.profit = profit;
	}

	public Long getAward() {
		return award;
	}

	public void setAward(Long award) {
		this.award = award;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

}