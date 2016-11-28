package com.fanglin.report.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.data.po.VillagePO;

@Entity
@Table(name = "villagecount", catalog = "report")
public class VillageCountPO implements java.io.Serializable {

	private static final long serialVersionUID = 7939769521818798794L;
	
	public static final String COLUMN_VILLAGE_X_STR = "village.x";
	
	public static final String COLUMN_VILLAGE_Y_STR = "village.y";

	private Long vcId;
	
	private VillagePO village;
	
	private int consult;
	
	private int amount;
	
	private int quotation;
	
	private int deposit;
	
	private int resigned;
	
	private int signed;
	
	private int waste;
	
	private int completed;
	
	private int termination;
	
	private double contractPrice;
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "vcId")
	public Long getVcId() {
		return this.vcId;
	}

	public void setVcId(Long vcId) {
		this.vcId = vcId;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(nullable = true, name = "vId", referencedColumnName="vId")
	public VillagePO getVillage() {
		return village;
	}

	public void setVillage(VillagePO village) {
		this.village = village;
	}
	
	@Column(name = "consult")
	public int getConsult() {
		return consult;
	}

	public void setConsult(int consult) {
		this.consult = consult;
	}

	@Column(name = "amount")
	public int getAmount() {
		return amount;
	}

	public void setAmount(int amount) {
		this.amount = amount;
	}

	@Column(name = "quotation")
	public int getQuotation() {
		return quotation;
	}

	public void setQuotation(int quotation) {
		this.quotation = quotation;
	}

	@Column(name = "deposit")
	public int getDeposit() {
		return deposit;
	}

	public void setDeposit(int deposit) {
		this.deposit = deposit;
	}

	@Column(name = "resigned")
	public int getResigned() {
		return resigned;
	}

	public void setResigned(int resigned) {
		this.resigned = resigned;
	}

	@Column(name = "signed")
	public int getSigned() {
		return signed;
	}

	public void setSigned(int signed) {
		this.signed = signed;
	}

	@Column(name = "waste")
	public int getWaste() {
		return waste;
	}

	public void setWaste(int waste) {
		this.waste = waste;
	}

	@Column(name = "completed")
	public int getCompleted() {
		return completed;
	}

	public void setCompleted(int completed) {
		this.completed = completed;
	}

	@Column(name = "termination")
	public int getTermination() {
		return termination;
	}

	public void setTermination(int termination) {
		this.termination = termination;
	}

	@Column(name = "contractPrice")
	public double getContractPrice() {
		return contractPrice;
	}

	public void setContractPrice(double contractPrice) {
		this.contractPrice = contractPrice;
	}

}