package com.fanglin.market.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="cardPhoto", catalog = "market")
public class CardPhotoPO implements Serializable{

	private static final long serialVersionUID = -2174768717904601988L;
	
	public static final String COLUMN_CAID_INT = "caid";

	private long cpid;
	
	private long caid;
	
	private String url;

	public CardPhotoPO() {
		super();
	}

	@Id
	@GeneratedValue
	@Column(name="cpid")
	public long getCpid() {
		return cpid;
	}

	public void setCpid(long cpid) {
		this.cpid = cpid;
	}

	@Column(name="caid")
	public long getCaid() {
		return caid;
	}

	public void setCaid(long caid) {
		this.caid = caid;
	}

	@Column(name="url")
	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}
	
}
