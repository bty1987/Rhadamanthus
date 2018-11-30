package com.fanglin.market.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "epicture", catalog = "market")
public class EpicturePO implements Serializable{

	private static final long serialVersionUID = 444275735585633980L;
	
	public static final String EPICTURE_CID_STR = "cid"; 

	private long epid;
	
	private long cid;
	
	private String url;
	
	@Id
	@GeneratedValue
	@Column(name = "epid")
	public long getEpid() {
		return epid;
	}

	public void setEpid(long epid) {
		this.epid = epid;
	}
	
	@Column(name = "cid")
	public long getCid() {
		return cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
	}

	@Column(name = "url")
	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}
	
}
