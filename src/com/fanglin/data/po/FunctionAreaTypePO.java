package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "functionareatype", catalog = "quotation")
public class FunctionAreaTypePO implements Serializable {

	private static final long serialVersionUID = -6743289150921842756L;

	public static final short STATUS_ENABLE_INT = 0;

	public static final short STATUS_DISABLE_INT = 1;

	private long fatId;

	private String name;

	private int company;

	private short status;

	public FunctionAreaTypePO() {
		super();
	}

	public FunctionAreaTypePO(long fatId) {
		super();
		this.fatId = fatId;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "fatId")
	public long getFatId() {
		return fatId;
	}

	public void setFatId(long fatId) {
		this.fatId = fatId;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

}
