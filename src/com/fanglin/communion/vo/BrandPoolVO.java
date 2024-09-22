package com.fanglin.communion.vo;

import java.io.Serializable;

public class BrandPoolVO implements Serializable {

	private static final long serialVersionUID = -581940987459219401L;

	private Long bpid;

	private CategoryVO category;

	private String no;

	private String name;

	private String pinyin;

	private String kino;

	private String kiname;

	private Short status;

	private String comment;

	public BrandPoolVO() {
		super();
	}

	public BrandPoolVO(CategoryVO category) {
		super();
		this.category = category;
	}

	public Long getBpid() {
		return bpid;
	}

	public void setBpid(Long bpid) {
		this.bpid = bpid;
	}

	public CategoryVO getCategory() {
		return category;
	}

	public void setCategory(CategoryVO category) {
		this.category = category;
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

	public String getPinyin() {
		return pinyin;
	}

	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
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
