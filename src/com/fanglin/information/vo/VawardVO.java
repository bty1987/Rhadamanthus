package com.fanglin.information.vo;

public class VawardVO implements java.io.Serializable {

	private static final long serialVersionUID = 6736967069684576506L;

	private Long vaid;

	private Long vpid;

	private String no;

	private String name;

	private Integer price;

	private Integer num;

	private String unit;

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

	public Integer getPrice() {
		return price;
	}

	public void setPrice(Integer price) {
		this.price = price;
	}

	public Integer getNum() {
		return num;
	}

	public void setNum(Integer num) {
		this.num = num;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}