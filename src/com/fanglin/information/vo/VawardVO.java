package com.fanglin.information.vo;

public class VawardVO implements java.io.Serializable {

	private static final long serialVersionUID = 6736967069684576506L;

	private Long vaid;
	
	private Long vpid;
	
	private String no;
	
	private String name;
	
	private Float price;
	
	private Float num;
	
	private Short status;

	public Long getVaid() {
		return vaid;
	}

	public void setVaid(Long vaid) {
		this.vaid = vaid;
	}

	public Long getVpid() {
		return vpid;
	}

	public void setVpid(Long vpid) {
		this.vpid = vpid;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
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

	public Float getNum() {
		return num;
	}

	public void setNum(Float num) {
		this.num = num;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}
	
}