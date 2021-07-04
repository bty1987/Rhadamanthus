package com.fanglin.data.po;

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

import com.fanglin.data.po.ConstructionNodePO;

@Entity
@Table(name = "additem", catalog = "data")
public class AdditemPO implements Serializable{

	private static final long serialVersionUID = -1109476732868699253L;
	
	public static final String COLUMN_CNID_STR = "constructionNode.cnid";
	
	public static final short STATUS_START_SHORT = 0;
	
	public static final short STATUS_STOP_SHORT = 1;

	private long aiid;

	private String name;

	private ConstructionNodePO  constructionNode;

	private short status;
	
	private int company;

	public AdditemPO() {
		super();
	}

	public AdditemPO(ConstructionNodePO constructionNode) {
		super();
		this.constructionNode = constructionNode;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "aiid")
	public long getAiid() {
		return aiid;
	}

	public void setAiid(long aiid) {
		this.aiid = aiid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cnid", referencedColumnName="cnid")	
	public ConstructionNodePO getConstructionNode() {
		return constructionNode;
	}

	public void setConstructionNode(ConstructionNodePO constructionNode) {
		this.constructionNode = constructionNode;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}
}
