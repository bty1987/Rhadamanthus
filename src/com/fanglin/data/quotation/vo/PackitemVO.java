package com.fanglin.data.quotation.vo;

import java.io.Serializable;

import com.fanglin.data.common.vo.ConstructionNodeVO;


public class PackitemVO implements Serializable {

	private static final long serialVersionUID = 1892909861596612250L;

	private long piid;

	private String name;

	private ConstructionNodeVO  constructionNode;

	private String ounit;

	private String tunit;
	
	private int trannum;

	private short status;
	

	public PackitemVO() {
		super();
	}
	
	public PackitemVO(ConstructionNodeVO constructionNode) {
		super();
		this.constructionNode = constructionNode;
	}

	public long getPiid() {
		return piid;
	}

	public void setPiid(long piid) {
		this.piid = piid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public ConstructionNodeVO getConstructionNode() {
		return constructionNode;
	}

	public void setConstructionNode(ConstructionNodeVO constructionNode) {
		this.constructionNode = constructionNode;
	}

	public String getOunit() {
		return ounit;
	}

	public void setOunit(String ounit) {
		this.ounit = ounit;
	}

	public String getTunit() {
		return tunit;
	}

	public void setTunit(String tunit) {
		this.tunit = tunit;
	}

	public int getTrannum() {
		return trannum;
	}

	public void setTrannum(int trannum) {
		this.trannum = trannum;
	}

	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
	
}
