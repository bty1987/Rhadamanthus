package com.fanglin.information.vo;

public class VprizeVO implements java.io.Serializable {

	private static final long serialVersionUID = 181800356765547961L;

	private Long vpid;
	
	private Long vaid;
	
	private String name;
	
	private Float price;
	
	private Short status;

	public Long getVpid() {
		return vpid;
	}

	public void setVpid(Long vpid) {
		this.vpid = vpid;
	}

	public Long getVaid() {
		return vaid;
	}

	public void setVaid(Long vaid) {
		this.vaid = vaid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Float getPrice() {
		return price;
	}

	public void setPrice(Float price) {
		this.price = price;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}
	
}