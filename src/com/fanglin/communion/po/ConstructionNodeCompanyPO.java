package com.fanglin.communion.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "constructionNodeCompany", catalog = "communion")
public class ConstructionNodeCompanyPO implements Serializable {

	private static final long serialVersionUID = 7434364138129555698L;
	
	public static final String COLUMN_CID_STR = "cid";
	
	private long cncid;
	
	private int cid;
	
	private ConstructionNodePO constructionNode;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "cncid")
	public long getCncid() {
		return cncid;
	}

	public void setCncid(long cncid) {
		this.cncid = cncid;
	}

	@Column(name = "cid")
	public int getCid() {
		return cid;
	}

	public void setCid(int cid) {
		this.cid = cid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cnid", referencedColumnName = "cnid")
	public ConstructionNodePO getConstructionNode() {
		return constructionNode;
	}

	public void setConstructionNode(ConstructionNodePO constructionNode) {
		this.constructionNode = constructionNode;
	}
	
}
