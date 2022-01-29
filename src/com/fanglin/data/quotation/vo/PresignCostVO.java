package com.fanglin.data.quotation.vo;

import java.io.Serializable;

public class PresignCostVO implements Serializable {

	private static final long serialVersionUID = 1505672489644456931L;

	private Long pcid;
	
	private Long ppid;

	private Integer toplimit;
	
	private Integer lowlimit;
	
	private Integer costPrice;

	public PresignCostVO(){
		super();
	}
	
	public Long getPcid() {
		return pcid;
	}

	public void setPcid(Long pcid) {
		this.pcid = pcid;
	}

	public Long getPpid() {
		return ppid;
	}

	public void setPpid(Long ppid) {
		this.ppid = ppid;
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
