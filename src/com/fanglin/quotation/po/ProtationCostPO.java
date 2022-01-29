package com.fanglin.quotation.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "protationcost", catalog = "quotation")
public class ProtationCostPO implements Serializable {

	private static final long serialVersionUID = 7241155025494572721L;

	private long pcid;
	
	private long pid;
	
	private int toplimit;
	
	private int lowlimit;
	
	private int costPrice;

	public ProtationCostPO(){
		super();
	}
	
	public ProtationCostPO(long pcid){
		super();
		this.pcid = pcid;
	}
	
	@Id
	@GeneratedValue
	@Column(name = "pcid")
	public long getPcid() {
		return pcid;
	}

	public void setPcid(long pcid) {
		this.pcid = pcid;
	}

	@Column(name = "pid")
	public long getPid() {
		return pid;
	}

	public void setPid(long pid) {
		this.pid = pid;
	}

	@Column(name = "toplimit")
	public int getToplimit() {
		return toplimit;
	}

	public void setToplimit(int toplimit) {
		this.toplimit = toplimit;
	}

	@Column(name = "lowlimit")
	public int getLowlimit() {
		return lowlimit;
	}

	public void setLowlimit(int lowlimit) {
		this.lowlimit = lowlimit;
	}

	@Column(name = "costPrice")
	public int getCostPrice() {
		return costPrice;
	}

	public void setCostPrice(int costPrice) {
		this.costPrice = costPrice;
	}
	
	
}
