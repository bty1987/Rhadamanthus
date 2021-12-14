package com.fanglin.communion.vo;

public class PaymentTypeVO implements java.io.Serializable {
	
	private static final long serialVersionUID = 7028737027192217079L;

	private Long ptid;

	private String name;
	
	private Short type;
	
	private Short paytype;
	
	private Short bustype;
	
	private Short atttype;
	
	private Integer code;
	
	private Short taxrate;

	private String kino;

	private String kiname;

	private String kibalance;
	
	private Short status;

	public PaymentTypeVO() {
		super();
	}

	public PaymentTypeVO(Long ptid) {
		super();
		this.ptid = ptid;
	}

	public Long getPtid() {
		return ptid;
	}

	public void setPtid(Long ptid) {
		this.ptid = ptid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getPaytype() {
		return paytype;
	}

	public void setPaytype(Short paytype) {
		this.paytype = paytype;
	}

	public Short getBustype() {
		return bustype;
	}

	public void setBustype(Short bustype) {
		this.bustype = bustype;
	}

	public Short getAtttype() {
		return atttype;
	}

	public void setAtttype(Short atttype) {
		this.atttype = atttype;
	}

	public Integer getCode() {
		return code;
	}

	public void setCode(Integer code) {
		this.code = code;
	}

	public Short getTaxrate() {
		return taxrate;
	}

	public void setTaxrate(Short taxrate) {
		this.taxrate = taxrate;
	}

	public String getKino() {
		return kino;
	}

	public void setKino(String kino) {
		this.kino = kino;
	}

	public String getKiname() {
		return kiname;
	}

	public void setKiname(String kiname) {
		this.kiname = kiname;
	}

	public String getKibalance() {
		return kibalance;
	}

	public void setKibalance(String kibalance) {
		this.kibalance = kibalance;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}