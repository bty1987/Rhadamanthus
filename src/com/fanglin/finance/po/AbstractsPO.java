package com.fanglin.finance.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "abstracts", catalog = "finance")
public class AbstractsPO implements java.io.Serializable {

	private static final long serialVersionUID = 1160719707662474853L;
	
	public static final String COLUMN_OWNERID_STR = "ownerId";

	private Integer aid;
	
	private Integer ownerId;
	
	private String abstracts;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "aId")
	public Integer getAid() {
		return this.aid;
	}

	public void setAid(Integer aid) {
		this.aid = aid;
	}

	@Column(name = "ownerId")
	public Integer getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(Integer ownerId) {
		this.ownerId = ownerId;
	}

	@Column(name = "abstracts")
	public String getAbstracts() {
		return this.abstracts;
	}

	public void setAbstracts(String abstracts) {
		this.abstracts = abstracts;
	}

}