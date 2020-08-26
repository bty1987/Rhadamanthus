package com.fanglin.quotation.vo;

import java.io.Serializable;
import java.util.List;

public class QuotetionFunctionAreaVO implements Serializable {

	private static final long serialVersionUID = -6568973240707170532L;

	private Long qfaId;
	
	private Long qid;
	
	private String name;
	
	private Integer functionAreaOrder;
	
	private Short type;
	
	private List<QuotetionFunctionAreaItemVO> quotetionFunctionAreaItems;

	public Long getQfaId() {
		return qfaId;
	}

	public void setQfaId(Long qfaId) {
		this.qfaId = qfaId;
	}

	public Long getQid() {
		return qid;
	}

	public void setQid(Long qid) {
		this.qid = qid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getFunctionAreaOrder() {
		return functionAreaOrder;
	}

	public void setFunctionAreaOrder(Integer functionAreaOrder) {
		this.functionAreaOrder = functionAreaOrder;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public List<QuotetionFunctionAreaItemVO> getQuotetionFunctionAreaItems() {
		return quotetionFunctionAreaItems;
	}

	public void setQuotetionFunctionAreaItems(List<QuotetionFunctionAreaItemVO> quotetionFunctionAreaItems) {
		this.quotetionFunctionAreaItems = quotetionFunctionAreaItems;
	}
	
	
}
