package com.fanglin.construction.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "constructionCost", catalog = "construction")
public class ConstructionCostPO implements Serializable {

	private static final long serialVersionUID = 7534364137121554699L;

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_SORT_STR = "sort";

	public static final short STATUS_INIT_SHORT = 0;
	
	public static final long ACCESSORY_DEFAULT_LONG = 99999000;
	
	public static final long SALARY_DEFAULT_LONG = 99999000;

	private long ccid;

	private String name;

	private int areaLeft;

	private int areaRight;

	private long accessory;

	private long salary;

	private short status;

	private short sort;

	private int company;
	
	public ConstructionCostPO() {
		super();
	}
	
	public ConstructionCostPO(long ccid) {
		super();
		this.ccid = ccid;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "ccid")
	public long getCcid() {
		return ccid;
	}

	public void setCcid(long ccid) {
		this.ccid = ccid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "areaLeft")
	public int getAreaLeft() {
		return areaLeft;
	}

	public void setAreaLeft(int areaLeft) {
		this.areaLeft = areaLeft;
	}

	@Column(name = "areaRight")
	public int getAreaRight() {
		return areaRight;
	}

	public void setAreaRight(int areaRight) {
		this.areaRight = areaRight;
	}

	@Column(name = "accessory")
	public long getAccessory() {
		return accessory;
	}

	public void setAccessory(long accessory) {
		this.accessory = accessory;
	}

	@Column(name = "salary")
	public long getSalary() {
		return salary;
	}

	public void setSalary(long salary) {
		this.salary = salary;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "sort")
	public short getSort() {
		return sort;
	}

	public void setSort(short sort) {
		this.sort = sort;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
