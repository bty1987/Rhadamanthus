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
@Table(name = "packitem", catalog = "data")
public class PackitemPO implements Serializable{

	private static final long serialVersionUID = -1109476732868699253L;
	
	public static final String COLUMN_CNID_STR = "constructionNode.cnid";
	
	public static final short STATUS_START_SHORT = 0;
	
	public static final short STATUS_STOP_SHORT = 1;

	private long piid;

	private String name;

	private ConstructionNodePO  constructionNode;

	private String ounit;

	private String tunit;
	
	private int trannum;

	private short status;

	public PackitemPO() {
		super();
	}

	public PackitemPO(ConstructionNodePO constructionNode) {
		super();
		this.constructionNode = constructionNode;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "piid")
	public long getPiid() {
		return piid;
	}

	public void setPiid(long piid) {
		this.piid = piid;
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

	@Column(name = "ounit")
	public String getOunit() {
		return ounit;
	}

	public void setOunit(String ounit) {
		this.ounit = ounit;
	}

	@Column(name = "tunit")
	public String getTunit() {
		return tunit;
	}

	public void setTunit(String tunit) {
		this.tunit = tunit;
	}

	@Column(name = "trannum")
	public int getTrannum() {
		return trannum;
	}

	public void setTrannum(int trannum) {
		this.trannum = trannum;
	}

}
