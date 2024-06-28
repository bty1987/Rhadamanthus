package com.fanglin.communion.vo;

import com.fanglin.personel.vo.UserBaseVO;

public class BrandVO implements java.io.Serializable {

	private static final long serialVersionUID = -7415918438727720875L;

	private Long bid;

	private String no;

	private String name;

	private String alias;

	private String pinyin;

	private Long cid;

	private String categoryId;

	private String categoryName;

	private UserBaseVO supplier;

	private Short atttype;

	private String agentName;

	private String agentPhone;

	private String comment;

	private int company;

	private String kino;

	private String kiname;

	public BrandVO() {
		super();
	}

	public BrandVO(UserBaseVO supplier) {
		super();
		this.supplier = supplier;
	}

	public Long getBid() {
		return bid;
	}

	public void setBid(Long bid) {
		this.bid = bid;
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

	public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
	}

	public String getPinyin() {
		return pinyin;
	}

	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public String getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(String categoryId) {
		this.categoryId = categoryId;
	}

	public String getCategoryName() {
		return categoryName;
	}

	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}

	public UserBaseVO getSupplier() {
		return supplier;
	}

	public void setSupplier(UserBaseVO supplier) {
		this.supplier = supplier;
	}

	public Short getAtttype() {
		return atttype;
	}

	public void setAtttype(Short atttype) {
		this.atttype = atttype;
	}

	public String getAgentName() {
		return agentName;
	}

	public void setAgentName(String agentName) {
		this.agentName = agentName;
	}

	public String getAgentPhone() {
		return agentPhone;
	}

	public void setAgentPhone(String agentPhone) {
		this.agentPhone = agentPhone;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
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