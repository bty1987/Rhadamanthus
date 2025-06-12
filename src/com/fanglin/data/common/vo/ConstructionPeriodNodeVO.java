package com.fanglin.data.common.vo;

import java.io.Serializable;

public class ConstructionPeriodNodeVO implements Serializable {

	private static final long serialVersionUID = -665024502622400929L;

	private Long cpnid;

	private Long cpid;

	private String name;

	private Integer period;

	private ConstructionNodeVO constructionNode;

	public ConstructionPeriodNodeVO() {
		super();
	}

	public ConstructionPeriodNodeVO(ConstructionNodeVO constructionNode) {
		super();
		this.constructionNode = constructionNode;
	}

	public Long getCpnid() {
		return cpnid;
	}

	public void setCpnid(Long cpnid) {
		this.cpnid = cpnid;
	}

	public Long getCpid() {
		return cpid;
	}

	public void setCpid(Long cpid) {
		this.cpid = cpid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getPeriod() {
		return period;
	}

	public void setPeriod(Integer period) {
		this.period = period;
	}

	public ConstructionNodeVO getConstructionNode() {
		return constructionNode;
	}

	public void setConstructionNode(ConstructionNodeVO constructionNode) {
		this.constructionNode = constructionNode;
	}

}
