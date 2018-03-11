package com.fanglin.finance.vo;

import java.sql.Timestamp;
import java.util.Set;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserVO;

public class VoucherVO implements java.io.Serializable {

	private static final long serialVersionUID = 6236686725933571839L;

	private Long vid;
	
	private String voucherId;
	
	private String word;
	
	private int wordnum;
	
	private Timestamp createTime;
	
	private String period;
	
	private UserVO originator;
	
	private UserVO auditor;
	
	private Timestamp auditTime;
	
	private UserVO postor;
	
	private Timestamp postTime;
	
	private UserVO authorizer;
	
	private UserVO cashier;
	
	private String reference;
	
	private Integer attachmentNum;
	
	private String comment;
	
	private Short status;
	
	private Short lockFlag;
	
	private Set<AccountVO> accounts;

	public Long getVid() {
		return vid;
	}

	public void setVid(Long vid) {
		this.vid = vid;
	}

	public String getVoucherId() {
		return voucherId;
	}

	public void setVoucherId(String voucherId) {
		this.voucherId = voucherId;
	}

	public String getWord() {
		return word;
	}

	public void setWord(String word) {
		this.word = word;
	}

	public int getWordnum() {
		return wordnum;
	}

	public void setWordnum(int wordnum) {
		this.wordnum = wordnum;
	}

	@JSON(format="yyyy-MM-dd")
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

	public UserVO getOriginator() {
		return originator;
	}

	public void setOriginator(UserVO originator) {
		this.originator = originator;
	}

	public UserVO getAuditor() {
		return auditor;
	}

	public void setAuditor(UserVO auditor) {
		this.auditor = auditor;
	}

	public UserVO getPostor() {
		return postor;
	}

	public void setPostor(UserVO postor) {
		this.postor = postor;
	}

	public UserVO getAuthorizer() {
		return authorizer;
	}

	public void setAuthorizer(UserVO authorizer) {
		this.authorizer = authorizer;
	}

	public UserVO getCashier() {
		return cashier;
	}

	public void setCashier(UserVO cashier) {
		this.cashier = cashier;
	}

	public String getReference() {
		return reference;
	}

	public void setReference(String reference) {
		this.reference = reference;
	}

	public Integer getAttachmentNum() {
		return attachmentNum;
	}

	public void setAttachmentNum(Integer attachmentNum) {
		this.attachmentNum = attachmentNum;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getAuditTime() {
		return auditTime;
	}

	public void setAuditTime(Timestamp auditTime) {
		this.auditTime = auditTime;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getPostTime() {
		return postTime;
	}

	public void setPostTime(Timestamp postTime) {
		this.postTime = postTime;
	}

	public Short getLockFlag() {
		return lockFlag;
	}

	public void setLockFlag(Short lockFlag) {
		this.lockFlag = lockFlag;
	}

	public Set<AccountVO> getAccounts() {
		return accounts;
	}

	public void setAccounts(Set<AccountVO> accounts) {
		this.accounts = accounts;
	}

}