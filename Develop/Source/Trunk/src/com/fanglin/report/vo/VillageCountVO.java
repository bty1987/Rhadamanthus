package com.fanglin.report.vo;

import com.fanglin.data.common.vo.VillageVO;

public class VillageCountVO implements java.io.Serializable {

	private static final long serialVersionUID = 1545209438701473175L;

	private Long vcId;
	
	private VillageVO village;
	
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
	
	public VillageCountVO() {
		super();
	}

	public VillageCountVO(VillageVO village) {
		super();
		this.village = village;
	}

	public Long getVcId() {
		return vcId;
	}

	public void setVcId(Long vcId) {
		this.vcId = vcId;
	}

	public VillageVO getVillage() {
		return village;
	}

	public void setVillage(VillageVO village) {
		this.village = village;
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