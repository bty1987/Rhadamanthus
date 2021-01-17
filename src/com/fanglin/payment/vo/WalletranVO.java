package com.fanglin.payment.vo;

public class WalletranVO implements java.io.Serializable {

	private static final long serialVersionUID = -10398372686038816L;

	private Long wtid;
	
	private String no;
	
	private WalletVO wallet;
	
	private WalletVO tallet;
	
	private Long amount;
	
	private Short type;
	
	private Short status;
	
	private String comment;

	public WalletranVO() {
		super();
	}

	public WalletranVO(WalletVO wallet, WalletVO tallet) {
		super();
		this.wallet = wallet;
		this.tallet = tallet;
	}

	public Long getWtid() {
		return wtid;
	}

	public void setWtid(Long wtid) {
		this.wtid = wtid;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public WalletVO getWallet() {
		return wallet;
	}

	public void setWallet(WalletVO wallet) {
		this.wallet = wallet;
	}

	public WalletVO getTallet() {
		return tallet;
	}

	public void setTallet(WalletVO tallet) {
		this.tallet = tallet;
	}

	public Long getAmount() {
		return amount;
	}

	public void setAmount(Long amount) {
		this.amount = amount;
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

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
	
}