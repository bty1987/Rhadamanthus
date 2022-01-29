package com.fanglin.data.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "presigncost", catalog = "quotation")
public class PresignCostPO implements Serializable {
	
	private static final long serialVersionUID = 6449998744568937712L;

	private long pcid;
	
	private long ppid;
	
	private int toplimit;
	
	private int lowlimit;
	
	private int costPrice;
	
	public PresignCostPO(){
		super();
	}
	
	public PresignCostPO(long pcid){
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
	
	@Column(name = "ppid")
	public long getPpid() {
		return ppid;
	}

	public void setPpid(long ppid) {
		this.ppid = ppid;
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
