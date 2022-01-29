package com.fanglin.quotation.vo;

import java.io.Serializable;

public class ProtationCostVO implements Serializable {

	private static final long serialVersionUID = -3567152330800189929L;

	private Long pcid;
	
	private Long pid;
	
	private Integer toplimit;
	
	private Integer lowlimit;
	
	private Integer costPrice;
	
	public ProtationCostVO(){
		super();
	}

	public Long getPcid() {
		return pcid;
	}

	public void setPcid(Long pcid) {
		this.pcid = pcid;
	}

	public Long getPid() {
		return pid;
	}

	public void setPid(Long pid) {
		this.pid = pid;
	}

	public Integer getToplimit() {
		return toplimit;
	}

	public void setToplimit(Integer toplimit) {
		this.toplimit = toplimit;
	}

	public Integer getLowlimit() {
		return lowlimit;
	}

	public void setLowlimit(Integer lowlimit) {
		this.lowlimit = lowlimit;
	}

	public Integer getCostPrice() {
		return costPrice;
	}

	public void setCostPrice(Integer costPrice) {
		this.costPrice = costPrice;
	}	
}
