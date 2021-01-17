package com.fanglin.payment.vo;

import com.fanglin.personel.vo.UserBaseVO;

public class WalletVO implements java.io.Serializable {

	private static final long serialVersionUID = 2447694504811945088L;

	private Long wid;
	
	private UserBaseVO belonger;
	
	private String no;
	
	private String phone;
	
	private String identity;
	
	private Long balance;
	
	private Short type;
	
	private Short status;
	
	private Long amount;
	
	private String validCode;
	
	private String sn;

	public WalletVO() {
		super();
	}

	public WalletVO(UserBaseVO belonger) {
		super();
		this.belonger = belonger;
	}

	public Long getWid() {
		return wid;
	}

	public void setWid(Long wid) {
		this.wid = wid;
	}

	public UserBaseVO getBelonger() {
		return belonger;
	}

	public void setBelonger(UserBaseVO belonger) {
		this.belonger = belonger;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getIdentity() {
		return identity;
	}

	public void setIdentity(String identity) {
		this.identity = identity;
	}

	public Long getBalance() {
		return balance;
	}

	public void setBalance(Long balance) {
		this.balance = balance;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Long getAmount() {
		return amount;
	}

	public void setAmount(Long amount) {
		this.amount = amount;
	}

	public String getValidCode() {
		return validCode;
	}

	public void setValidCode(String validCode) {
		this.validCode = validCode;
	}

	public String getSn() {
		return sn;
	}

	public void setSn(String sn) {
		this.sn = sn;
	}
	
}