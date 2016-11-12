package com.fanglin.report.vo;

import java.util.Date;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.system.vo.RegionVO;

public class RegionCountDetailVO implements java.io.Serializable {

	private static final long serialVersionUID = -8694444386026523252L;
	
	private Long rcdId;
	
	private RegionVO region;
	
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

	public RegionCountDetailVO() {
		super();
	}

	public RegionCountDetailVO(RegionVO region) {
		super();
		this.region = region;
	}

	public Long getRcdId() {
		return rcdId;
	}

	public void setRcdId(Long rcdId) {
		this.rcdId = rcdId;
	}

	public RegionVO getRegion() {
		return region;
	}

	public void setRegion(RegionVO region) {
		this.region = region;
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