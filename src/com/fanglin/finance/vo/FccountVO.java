package com.fanglin.finance.vo;

import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class FccountVO implements java.io.Serializable {

	private static final long serialVersionUID = 2774749713524377749L;

	private Long aid;

	private VoucherVO voucher;

	private AssistantVO assistant;

	private String word;

	private Timestamp createTime;

	private String period;

	private Integer saId;

	private String abstracts;

	private String oneCode;

	private String twoCode;

	private String thrCode;

	private String subjectName;

	private Long debit;

	private Long credit;

	private Timestamp businessTime;

	private Short status;

	public FccountVO() {
		super();
	}

	public FccountVO(String word, String abstracts, Timestamp createTime, String period, Timestamp businessTime) {
		super();
		this.word = word;
		this.abstracts = abstracts;
		this.createTime = createTime;
		this.period = period;
		this.businessTime = businessTime;
	}

	public Long getAid() {
		return aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
	}

	public VoucherVO getVoucher() {
		return voucher;
	}

	public void setVoucher(VoucherVO voucher) {
		this.voucher = voucher;
	}

	public AssistantVO getAssistant() {
		return assistant;
	}

	public void setAssistant(AssistantVO assistant) {
		this.assistant = assistant;
	}

	public String getWord() {
		return word;
	}

	public void setWord(String word) {
		this.word = word;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public String getPeriod() {
		return period;
	}

	public void setPeriod(String period) {
		this.period = period;
	}

	public Integer getSaId() {
		return saId;
	}

	public void setSaId(Integer saId) {
		this.saId = saId;
	}

	public String getAbstracts() {
		return abstracts;
	}

	public void setAbstracts(String abstracts) {
		this.abstracts = abstracts;
	}

	public String getOneCode() {
		return oneCode;
	}

	public void setOneCode(String oneCode) {
		this.oneCode = oneCode;
	}

	public String getTwoCode() {
		return twoCode;
	}

	public void setTwoCode(String twoCode) {
		this.twoCode = twoCode;
	}

	public String getThrCode() {
		return thrCode;
	}

	public void setThrCode(String thrCode) {
		this.thrCode = thrCode;
	}

	public String getSubjectName() {
		return subjectName;
	}

	public void setSubjectName(String subjectName) {
		this.subjectName = subjectName;
	}

	public Long getDebit() {
		return debit;
	}

	public void setDebit(Long debit) {
		this.debit = debit;
	}

	public Long getCredit() {
		return credit;
	}

	public void setCredit(Long credit) {
		this.credit = credit;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getBusinessTime() {
		return businessTime;
	}

	public void setBusinessTime(Timestamp businessTime) {
		this.businessTime = businessTime;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}