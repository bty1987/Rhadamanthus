package com.fanglin.finance.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.sql.Timestamp;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fanglin.finance.vo.AccountVO;
import com.fanglin.finance.vo.VoucherVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "voucher", catalog = "finance")
public class VoucherPO implements java.io.Serializable {

	private static final long serialVersionUID = 5783085370591192385L;
	
	public static final String PERIOD_CC_STR = "CC";
	
	public static final String PERIOD_CR_STR = "CR";
	
	public static final int PERIOD_CC_INT = 18;
	
	public static final int PERIOD_CR_INT = 19;
	
	public static final short STATUS_TYPE_PRECUT_INT = 0;
	
	public static final short STATUS_TYPE_FORMAL_INT = 1;
	
	public static final short STATUS_TYPE_CLOSED_INT = 2;
	
	public static final short STATUS_TYPE_INFORMAL_INT = 3;
	
	public static final String COLUMN_VID_STR = "vid";

	private long vid;
	
	private String voucherId;
	
	private String word;
	
	private String period;
	
	private UserPO originator; // 创建
	
	private Timestamp createTime;
	
	private UserPO auditor; // 审计
	
	private Timestamp auditTime;
	
	private UserPO postor; // 过账
	
	private Timestamp postTime;
	
	private UserPO authorizer; // 批准
	
	private UserPO cashier; // 出纳
	
	private String reference;
	
	private int attachmentNum;
	
	private String comment;
	
	private short status;
	
	private long lockvalue;
	
	private Set<AccountPO> accounts;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "vId")
	public long getVid() {
		return this.vid;
	}

	public void setVid(long vid) {
		this.vid = vid;
	}

	@Column(name = "voucherId")
	public String getVoucherId() {
		return voucherId;
	}

	public void setVoucherId(String voucherId) {
		this.voucherId = voucherId;
	}

	@Column(name = "word")
	public String getWord() {
		return this.word;
	}

	public void setWord(String word) {
		this.word = word;
	}

	@Column(name = "createTime")
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

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "originatorId", referencedColumnName = "uId")
	public UserPO getOriginator() {
		return originator;
	}

	public void setOriginator(UserPO originator) {
		this.originator = originator;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "auditorId", referencedColumnName = "uId")
	public UserPO getAuditor() {
		return auditor;
	}

	public void setAuditor(UserPO auditor) {
		this.auditor = auditor;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "postorId", referencedColumnName = "uId")
	public UserPO getPostor() {
		return postor;
	}

	public void setPostor(UserPO postor) {
		this.postor = postor;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "authorizerId", referencedColumnName = "uId")
	public UserPO getAuthorizer() {
		return authorizer;
	}

	public void setAuthorizer(UserPO authorizer) {
		this.authorizer = authorizer;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cashierId", referencedColumnName = "uId")
	public UserPO getCashier() {
		return cashier;
	}

	public void setCashier(UserPO cashier) {
		this.cashier = cashier;
	}

	@Column(name = "reference")
	public String getReference() {
		return this.reference;
	}

	public void setReference(String reference) {
		this.reference = reference;
	}

	@Column(name = "attachmentNum")
	public int getAttachmentNum() {
		return this.attachmentNum;
	}

	public void setAttachmentNum(int attachmentNum) {
		this.attachmentNum = attachmentNum;
	}

	@Column(name = "comment")
	public String getComment() {
		return this.comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "status")
	public short getStatus() {
		return this.status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "auditTime")
	public Timestamp getAuditTime() {
		return auditTime;
	}

	public void setAuditTime(Timestamp auditTime) {
		this.auditTime = auditTime;
	}

	@Column(name = "postTime")
	public Timestamp getPostTime() {
		return postTime;
	}

	public void setPostTime(Timestamp postTime) {
		this.postTime = postTime;
	}
	
	@OneToMany(mappedBy="voucher")
	public Set<AccountPO> getAccounts() {
		return accounts;
	}

	public void setAccounts(Set<AccountPO> accounts) {
		this.accounts = accounts;
	}
	
	public long getLockvalue() {
		return lockvalue;
	}

	public void setLockvalue(long lockvalue) {
		this.lockvalue = lockvalue;
	}

	public VoucherVO packagePOToVO(boolean accountFlag){
		
		VoucherVO voucherVO = new VoucherVO();
		
		BeanUtil.copyProperties(this, voucherVO, Arrays.asList("originator", "auditor", "postor", "authorizer", "cashier", "accounts"));
		
		if(getOriginator() != null){
			voucherVO.setOriginator(new UserVO().setBaseInfo(getOriginator()));
		}
		
		if(getAuditor() != null){
			voucherVO.setAuditor(new UserVO().setBaseInfo(getAuditor()));
		}
		
		if(getPostor() != null){
			voucherVO.setPostor(new UserVO().setBaseInfo(getPostor()));
		}
		
		if(getAuthorizer() != null){
			voucherVO.setAuthorizer(new UserVO().setBaseInfo(getAuthorizer()));
		}
		
		if(getCashier() != null){
			voucherVO.setCashier(new UserVO().setBaseInfo(getCashier()));
		}
		
		if(accountFlag){
			Set<AccountVO> accountVOs = new HashSet<AccountVO>();
			
			for(AccountPO accountPO: accounts){
				
				AccountVO accountVO = new AccountVO();
				
				BeanUtil.copyProperties(accountPO, accountVO, Arrays.asList("voucher", "assistant"));
				
				if(accountPO.getAssistant() != null){
					accountVO.setAssistant(accountPO.getAssistant().packageFromPOToVO());
				}
				
				accountVOs.add(accountVO);
			}
			
			voucherVO.setAccounts(accountVOs);
		}else{
			voucherVO.setAccounts(null);
		}
		
		return voucherVO;
	}

}