package com.fanglin.quotation.vo;

import java.io.Serializable;

/**
 * 报价功能区×模板功能区品类关联(用于选材页公式匹配):
 * 报价功能区经 报价版本+功能区名 匹配模板功能区后,带出其下维护的品类关联行
 */
public class QuotationFunctionAreaCategoryVO implements Serializable {

	private static final long serialVersionUID = 7315402968214538027L;

	private Long qfaId;

	private String functionAreaName;

	private Long fcid;

	private Long cid;

	private String categoryName;

	public Long getQfaId() {
		return qfaId;
	}

	public void setQfaId(Long qfaId) {
		this.qfaId = qfaId;
	}

	public String getFunctionAreaName() {
		return functionAreaName;
	}

	public void setFunctionAreaName(String functionAreaName) {
		this.functionAreaName = functionAreaName;
	}

	public Long getFcid() {
		return fcid;
	}

	public void setFcid(Long fcid) {
		this.fcid = fcid;
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

}
