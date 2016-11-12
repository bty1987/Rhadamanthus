package com.fanglin.report.po;

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fanglin.system.po.CityProperPO;

@Entity
@Table(name = "citypropercountdetail", catalog = "report")
public class CityProperCountDetailPO implements java.io.Serializable {

	private static final long serialVersionUID = 9052972049501516562L;
	
	public static final String COLUMN_CREATEDATE_STR = "createDate";

	private long cpcdId;
	
	private CityProperPO cityProper;
	
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
	
	private Date createDate;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "cpcdId")
	public long getCpcdId() {
		return this.cpcdId;
	}

	public void setCpcdId(long cpcdId) {
		this.cpcdId = cpcdId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "cpId", referencedColumnName="cpId")
	public CityProperPO getCityProper() {
		return cityProper;
	}

	public void setCityProper(CityProperPO cityProper) {
		this.cityProper = cityProper;
	}

	@Temporal(TemporalType.DATE)
	@Column(name = "createDate")
	public Date getCreateDate() {
		return this.createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
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