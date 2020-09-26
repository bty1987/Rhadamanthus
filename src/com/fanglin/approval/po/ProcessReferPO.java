package com.fanglin.approval.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "processRefer", catalog = "approval")
public class ProcessReferPO implements Serializable {
	
	private static final long serialVersionUID = -8447425631811211633L;

	private long prid;
	
	private String id;
	
	private String name;
	
	private String type;
	
	public ProcessReferPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "prid")
	public long getPrid() {
		return prid;
	}

	public void setPrid(long prid) {
		this.prid = prid;
	}

	@Column(name = "id")
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "type")
	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

}
