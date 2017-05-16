package com.fanglin.finance.po;

import java.sql.Timestamp;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "accounttmp", catalog = "finance")
public class AccountTmpPO implements java.io.Serializable {

	private static final long serialVersionUID = 4912182041639421555L;
	
	public static final String COLUMN_ATID_STR = "atId";
	
	public static final String COLUMN_AID_STR = "aid";

	private long atId;
	
	private VoucherPO voucher;
	
	private AssistantTmpPO assistantTmp;
	
	private String word;
	
	private Timestamp createTime;
	
	private String period;
	
	private int saId;
	
	private String abstracts;
	
	private String oneCode;
	
	private String twoCode;
	
	private String thrCode;
	
	private String subjectName;
	
	private float debit;
	
	private float credit;
	
	private Timestamp businessTime;
	
	private short status;
	
	private long aid;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "atId")
	public long getAtId() {
		return this.atId;
	}

	public void setAtId(long atId) {
		this.atId = atId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "vId", referencedColumnName = "vId")
	public VoucherPO getVoucher() {
		return voucher;
	}

	public void setVoucher(VoucherPO voucher) {
		this.voucher = voucher;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "astId", referencedColumnName = "atId")
	public AssistantTmpPO getAssistantTmp() {
		return assistantTmp;
	}

	public void setAssistantTmp(AssistantTmpPO assistantTmp) {
		this.assistantTmp = assistantTmp;
	}

	@Column(name = "word")
	public String getWord() {
		return this.word;
	}

	public void setWord(String word) {
		this.word = word;
	}

	@Column(name = "createTime", length = 19)
	public Timestamp getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "period")
	public String getPeriod() {
		return this.period;
	}

	public void setPeriod(String period) {
		this.period = period;
	}

	@Column(name = "saId")
	public int getSaId() {
		return this.saId;
	}

	public void setSaId(int saId) {
		this.saId = saId;
	}

	@Column(name = "abstracts")
	public String getAbstracts() {
		return this.abstracts;
	}

	public void setAbstracts(String abstracts) {
		this.abstracts = abstracts;
	}

	@Column(name = "oneCode")
	public String getOneCode() {
		return this.oneCode;
	}

	public void setOneCode(String oneCode) {
		this.oneCode = oneCode;
	}

	@Column(name = "twoCode")
	public String getTwoCode() {
		return this.twoCode;
	}

	public void setTwoCode(String twoCode) {
		this.twoCode = twoCode;
	}

	@Column(name = "thrCode")
	public String getThrCode() {
		return this.thrCode;
	}

	public void setThrCode(String thrCode) {
		this.thrCode = thrCode;
	}

	@Column(name = "subjectName")
	public String getSubjectName() {
		return this.subjectName;
	}

	public void setSubjectName(String subjectName) {
		this.subjectName = subjectName;
	}

	@Column(name = "debit")
	public float getDebit() {
		return this.debit;
	}

	public void setDebit(float debit) {
		this.debit = debit;
	}

	@Column(name = "credit")
	public float getCredit() {
		return this.credit;
	}

	public void setCredit(float credit) {
		this.credit = credit;
	}

	@Column(name = "businessTime")
	public Timestamp getBusinessTime() {
		return this.businessTime;
	}

	public void setBusinessTime(Timestamp businessTime) {
		this.businessTime = businessTime;
	}

	@Column(name = "status")
	public short getStatus() {
		return this.status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "aId")
	public long getAid() {
		return this.aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}

}