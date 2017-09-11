package com.fanglin.payment.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "materialinsidepayment", catalog = "payment")
public class MaterialInsidePaymentPO implements java.io.Serializable {

	private static final long serialVersionUID = 8590198663194344857L;
	
	public static final String CURRENT_TIME_FORMAT_STR = "yyyy-MM-dd";
	
	public static final String COLUMN_MIID_STR = "miId";
	
	public static final String COLUMN_PAYMENTSTATUS_STR = "paymentStatus";
	
	public static final String COLUMN_PAYMENTTYPE_STR = "paymentType";
	
	public static final int PAYMENTSTATUS_TYPE_INIT_INT = 0;
	
	public static final int PAYMENTSTATUS_TYPE_COLLECT_INT = 1;
	
	public static final int PAYMENTSTATUS_TYPE_CONFIRM_INT = 2;

	private long mipId;
	
	private long miId;
	
	private int paymentType;
	
	private int paymentStatus;
	
	private String orderAddr;
	
	private String customerId;
	
	private String customerName;
	
	private String materialTypeName;
	
	private String materialBrandName;
	
	private String createUserId;
	
	private String createUserName;
	
	private String collectUserId;
	
	private String collectUserName;
	
	private String collectTime;
	
	private String confirmUserId;
	
	private String confirmUserName;
	
	private String confirmTime;
	
	private float referMoney;
	
	private float cash;
	
	private float bank;
	
	private String bankName;
	
	private float checkv;
	
	private String checkvBankName;
	
	private float installment;
	
	private String installmentBankName;
	
	private float accounts;
	
	private String accountsBankName;
	
	private String des;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "mipId")
	public long getMipId(){
		return this.mipId;
	}

	public void setMipId(long mipId){
		this.mipId = mipId;
	}

	@Column(name = "miId")
	public long getMiId(){
		return this.miId;
	}

	public void setMiId(long miId){
		this.miId = miId;
	}

	@Column(name = "paymentType")
	public int getPaymentType(){
		return this.paymentType;
	}

	public void setPaymentType(int paymentType){
		this.paymentType = paymentType;
	}

	@Column(name = "paymentStatus")
	public int getPaymentStatus(){
		return this.paymentStatus;
	}

	public void setPaymentStatus(int paymentStatus){
		this.paymentStatus = paymentStatus;
	}

	@Column(name = "orderAddr")
	public String getOrderAddr(){
		return this.orderAddr;
	}

	public void setOrderAddr(String orderAddr){
		this.orderAddr = orderAddr;
	}

	@Column(name = "customerName")
	public String getCustomerName(){
		return this.customerName;
	}

	public void setCustomerName(String customerName){
		this.customerName = customerName;
	}

	@Column(name = "materialTypeName")
	public String getMaterialTypeName(){
		return this.materialTypeName;
	}

	public void setMaterialTypeName(String materialTypeName){
		this.materialTypeName = materialTypeName;
	}

	@Column(name = "materialBrandName")
	public String getMaterialBrandName(){
		return this.materialBrandName;
	}

	public void setMaterialBrandName(String materialBrandName){
		this.materialBrandName = materialBrandName;
	}

	@Column(name = "createUserId")
	public String getCreateUserId(){
		return this.createUserId;
	}

	public void setCreateUserId(String createUserId){
		this.createUserId = createUserId;
	}

	@Column(name = "createUserName")
	public String getCreateUserName(){
		return this.createUserName;
	}

	public void setCreateUserName(String createUserName){
		this.createUserName = createUserName;
	}

	@Column(name = "collectUserId")
	public String getCollectUserId(){
		return this.collectUserId;
	}

	public void setCollectUserId(String collectUserId){
		this.collectUserId = collectUserId;
	}

	@Column(name = "collectUserName")
	public String getCollectUserName(){
		return this.collectUserName;
	}

	public void setCollectUserName(String collectUserName){
		this.collectUserName = collectUserName;
	}

	@Column(name = "collectTime")
	public String getCollectTime(){
		return this.collectTime;
	}

	public void setCollectTime(String collectTime){
		this.collectTime = collectTime;
	}

	@Column(name = "confirmUserId")
	public String getConfirmUserId(){
		return this.confirmUserId;
	}

	public void setConfirmUserId(String confirmUserId){
		this.confirmUserId = confirmUserId;
	}

	@Column(name = "confirmUserName")
	public String getConfirmUserName(){
		return this.confirmUserName;
	}

	public void setConfirmUserName(String confirmUserName){
		this.confirmUserName = confirmUserName;
	}

	@Column(name = "confirmTime")
	public String getConfirmTime(){
		return this.confirmTime;
	}

	public void setConfirmTime(String confirmTime){
		this.confirmTime = confirmTime;
	}

	@Column(name = "referMoney")
	public float getReferMoney(){
		return this.referMoney;
	}

	public void setReferMoney(float referMoney){
		this.referMoney = referMoney;
	}

	@Column(name = "cash")
	public float getCash(){
		return this.cash;
	}

	public void setCash(float cash){
		this.cash = cash;
	}

	@Column(name = "bank")
	public float getBank(){
		return this.bank;
	}

	public void setBank(float bank){
		this.bank = bank;
	}

	@Column(name = "bankName")
	public String getBankName(){
		return this.bankName;
	}

	public void setBankName(String bankName){
		this.bankName = bankName;
	}

	@Column(name = "checkv")
	public float getCheckv(){
		return this.checkv;
	}

	public void setCheckv(float checkv){
		this.checkv = checkv;
	}

	@Column(name = "checkvBankName")
	public String getCheckvBankName(){
		return this.checkvBankName;
	}

	public void setCheckvBankName(String checkvBankName){
		this.checkvBankName = checkvBankName;
	}

	@Column(name = "installment")
	public float getInstallment(){
		return this.installment;
	}

	public void setInstallment(float installment){
		this.installment = installment;
	}

	@Column(name = "installmentBankName")
	public String getInstallmentBankName(){
		return this.installmentBankName;
	}

	public void setInstallmentBankName(String installmentBankName){
		this.installmentBankName = installmentBankName;
	}

	@Column(name = "accounts")
	public float getAccounts(){
		return this.accounts;
	}

	public void setAccounts(float accounts){
		this.accounts = accounts;
	}

	@Column(name = "accountsBankName")
	public String getAccountsBankName(){
		return this.accountsBankName;
	}

	public void setAccountsBankName(String accountsBankName){
		this.accountsBankName = accountsBankName;
	}

	@Column(name = "des")
	public String getDes(){
		return this.des;
	}

	public void setDes(String des){
		this.des = des;
	}

	@Column(name = "customerId")
	public String getCustomerId(){
		return customerId;
	}

	public void setCustomerId(String customerId){
		this.customerId = customerId;
	}

}