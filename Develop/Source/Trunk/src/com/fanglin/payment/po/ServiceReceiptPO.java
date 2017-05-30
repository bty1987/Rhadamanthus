package com.fanglin.payment.po;

import static javax.persistence.GenerationType.IDENTITY;
import java.io.Serializable;
import java.sql.Timestamp;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "servicereceipt", catalog = "platform")
public class ServiceReceiptPO  implements Serializable{

	private static final long serialVersionUID = -1338386407765927692L;
	
	public static final String COLUMN_SRID_STR = "srId";
	
	public static final String COLUMN_INFO_STR = "";
	
	public static final Float COLUMN_MONEY_STR = 0f;
	
	public static final Short COLUMN_ADVANCETYPE_STR = 0;
	
	public static final Float COLUMN_RATIO_STR = 1.1f;
	
	private Long srId;        			//收据ID
	
	private UserPO collecter;
	
	private UserPO confirmer;
	
	private String collecterName;
	
	private String confirmerName;
	
	private Timestamp collectTime;
	
	private Timestamp confirmTime;
	
	private Float realMoney;
	
	private Float cash;                //现金
	
	private String cashInfo;           //现金信息
	
	private Float bank;                //刷卡
	
	private String bankInfo;           //刷卡信息;
	
	private Float checkv;              //转账
	
	private String checkvBank;         //转账银行
	
	private Float installment;         //分期
	
	private String installBank;        //分期银行
	
	private Float accounts;            //对公
	
	private String accountsBank;       //对公银行
	
	private String des;                //说明
	
	public ServiceReceiptPO() {
		super();
	}

	public ServiceReceiptPO(long srId) {
		super();
		this.srId = srId;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY) 
	@Column(name = "srid")
	public Long getSrId() {
		return srId;
	}

	public void setSrId(Long srId) {
		this.srId = srId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cluid", referencedColumnName = "uid")
	public UserPO getCollecter() {
		return collecter;
	}


	public void setCollecter(UserPO collecter) {
		this.collecter = collecter;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cfuid", referencedColumnName = "uid")
	public UserPO getConfirmer() {
		return confirmer;
	}


	public void setConfirmer(UserPO confirmer) {
		this.confirmer = confirmer;
	}
	
	@Column(name = "collecterName")
	public String getCollecterName() {
		return collecterName;
	}

	public void setCollecterName(String collecterName) {
		this.collecterName = collecterName;
	}

	@Column(name = "confirmerName")
	public String getConfirmerName() {
		return confirmerName;
	}

	public void setConfirmerName(String confirmerName) {
		this.confirmerName = confirmerName;
	}

	@Column(name = "collectTime")
	public Timestamp getCollectTime() {
		return collectTime;
	}

	public void setCollectTime(Timestamp collectTime) {
		this.collectTime = collectTime;
	}

	@Column(name = "confirmTime")
	public Timestamp getConfirmTime() {
		return confirmTime;
	}

	public void setConfirmTime(Timestamp confirmTime) {
		this.confirmTime = confirmTime;
	}

	@Column(name = "realMoney")
	public Float getRealMoney() {
		return realMoney;
	}

	public void setRealMoney(Float realMoney) {
		this.realMoney = realMoney;
	}

	@Column(name = "cash")
	public Float getCash() {
		return cash;
	}

	public void setCash(Float cash) {
		this.cash = cash;
	}

	@Column(name = "cashInfo")
	public String getCashInfo() {
		return cashInfo;
	}

	public void setCashInfo(String cashInfo) {
		this.cashInfo = cashInfo;
	}

	@Column(name = "bank")
	public Float getBank() {
		return bank;
	}

	public void setBank(Float bank) {
		this.bank = bank;
	}

	@Column(name = "bankInfo")
	public String getBankInfo() {
		return bankInfo;
	}

	public void setBankInfo(String bankInfo) {
		this.bankInfo = bankInfo;
	}

	@Column(name = "checkv")
	public Float getCheckv() {
		return checkv;
	}

	public void setCheckv(Float checkv) {
		this.checkv = checkv;
	}

	@Column(name = "checkvBank")
	public String getCheckvBank() {
		return checkvBank;
	}

	public void setCheckvBank(String checkvBank) {
		this.checkvBank = checkvBank;
	}
	
	@Column(name = "installment")
	public Float getInstallment() {
		return installment;
	}

	public void setInstallment(Float installment) {
		this.installment = installment;
	}

	@Column(name = "installmentBank")
	public String getInstallBank() {
		return installBank;
	}

	public void setInstallBank(String installBank) {
		this.installBank = installBank;
	}

	@Column(name = "accounts")
	public Float getAccounts() {
		return accounts;
	}

	public void setAccounts(Float accounts) {
		this.accounts = accounts;
	}

	@Column(name = "accountsBank")
	public String getAccountsBank() {
		return accountsBank;
	}

	public void setAccountsBank(String accountsBank) {
		this.accountsBank = accountsBank;
	}

	@Column(name = "des")
	public String getDes() {
		return des;
	}

	public void setDes(String des) {
		this.des = des;
	}
	
}
