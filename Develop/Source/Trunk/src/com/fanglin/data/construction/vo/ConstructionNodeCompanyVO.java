package com.fanglin.data.construction.vo;

import java.io.Serializable;

public class ConstructionNodeCompanyVO implements Serializable {

	private static final long serialVersionUID = 7434364138129555699L;
	
	private Long cncid;
	
	private Long cid;
	
	private ConstructionNodeVO constructionNode;

	public Long getCncid() {
		return cncid;
	}

	public void setCncid(Long cncid) {
		this.cncid = cncid;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public ConstructionNodeVO getConstructionNode() {
		return constructionNode;
	}

	public void setConstructionNode(ConstructionNodeVO constructionNode) {
		this.constructionNode = constructionNode;
	}
	
}
