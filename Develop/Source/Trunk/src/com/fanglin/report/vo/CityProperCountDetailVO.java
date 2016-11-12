package com.fanglin.report.vo;

import java.util.Date;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.system.vo.CityProperVO;

public class CityProperCountDetailVO implements java.io.Serializable {

	private static final long serialVersionUID = -2940275377190785119L;

	private Long cpcdId;
	
	private CityProperVO cityProper;
	
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

	public CityProperCountDetailVO() {
		super();
	}

	public CityProperCountDetailVO(CityProperVO cityProper) {
		super();
		this.cityProper = cityProper;
	}

	public Long getCpcdId() {
		return cpcdId;
	}

	public void setCpcdId(Long cpcdId) {
		this.cpcdId = cpcdId;
	}

	public CityProperVO getCityProper() {
		return cityProper;
	}

	public void setCityProper(CityProperVO cityProper) {
		this.cityProper = cityProper;
	}

	@JSON(format="yyyy-MM-dd")
	public Date getCreateDate() {
		return createDate;
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