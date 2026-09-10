package com.fanglin.data.quotation.vo;

import java.io.Serializable;
import java.util.List;

public class FunctionAreaCategoryVO implements Serializable {

	private static final long serialVersionUID = -3718492054762831549L;

	private Long fcid;

	private Long faid;

	private Long cid;

	private String categoryName;

	private List<FunctionAreaFormatVO> formats;

	public FunctionAreaCategoryVO() {
		super();
	}

	public Long getFcid() {
		return fcid;
	}

	public void setFcid(Long fcid) {
		this.fcid = fcid;
	}

	public Long getFaid() {
		return faid;
	}

	public void setFaid(Long faid) {
		this.faid = faid;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public String getCategoryName() {
		return categoryName;
	}

	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}

	public List<FunctionAreaFormatVO> getFormats() {
		return formats;
	}

	public void setFormats(List<FunctionAreaFormatVO> formats) {
		this.formats = formats;
	}

}
