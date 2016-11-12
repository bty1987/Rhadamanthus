package com.fanglin.report.vo;

import java.util.Date;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.system.vo.CityVO;

public class CityCountDetailVO implements java.io.Serializable {

	private static final long serialVersionUID = 668512292231398078L;

	private Long ccdId;
	
	private CityVO city;
	
	private Integer consult;
	
	private Integer amount;
	
	private Integer quotation;
	
	private Integer deposit;
	
	private Integer resigned;
	
	private Integer signed;
	
	private Integer waste;
	
	private Integer completed;
	
	private Integer termination;
	
	private Double contractPrice;
	
	private Date createDate;

	public CityCountDetailVO() {
		super();
	}

	public CityCountDetailVO(CityVO city) {
		super();
		this.city = city;
	}

	public Long getCcdId() {
		return this.ccdId;
	}

	public void setCcdId(Long ccdId) {
		this.ccdId = ccdId;
	}

	public CityVO getCity() {
		return city;
	}

	public void setCity(CityVO city) {
		this.city = city;
	}

	@JSON(format="yyyy-MM-dd")
	public Date getCreateDate() {
		return this.createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public Integer getConsult() {
		return consult;
	}

	public void setConsult(Integer consult) {
		this.consult = consult;
	}

	public Integer getAmount() {
		return amount;
	}

	public void setAmount(Integer amount) {
		this.amount = amount;
	}

	public Integer getQuotation() {
		return quotation;
	}

	public void setQuotation(Integer quotation) {
		this.quotation = quotation;
	}

	public Integer getDeposit() {
		return deposit;
	}

	public void setDeposit(Integer deposit) {
		this.deposit = deposit;
	}

	public Integer getResigned() {
		return resigned;
	}

	public void setResigned(Integer resigned) {
		this.resigned = resigned;
	}

	public Integer getSigned() {
		return signed;
	}

	public void setSigned(Integer signed) {
		this.signed = signed;
	}

	public Integer getWaste() {
		return waste;
	}

	public void setWaste(Integer waste) {
		this.waste = waste;
	}

	public Integer getCompleted() {
		return completed;
	}

	public void setCompleted(Integer completed) {
		this.completed = completed;
	}

	public Integer getTermination() {
		return termination;
	}

	public void setTermination(Integer termination) {
		this.termination = termination;
	}

	public Double getContractPrice() {
		return contractPrice;
	}

	public void setContractPrice(Double contractPrice) {
		this.contractPrice = contractPrice;
	}

}