package com.fanglin.communion.vo;

public class CategoryVO implements java.io.Serializable {

	private static final long serialVersionUID = 3848977556963217583L;

	private Long cid;

	private String no;

	private String name;

	private Short type;

	private Short isCoupon;

	private Short isCount;

	private String kino;

	private String kiname;

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
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

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getIsCoupon() {
		return isCoupon;
	}

	public void setIsCoupon(Short isCoupon) {
		this.isCoupon = isCoupon;
	}

	public Short getIsCount() {
		return isCount;
	}

	public void setIsCount(Short isCount) {
		this.isCount = isCount;
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

}