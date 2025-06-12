package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.data.common.vo.ConstructionPeriodVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "ConstructionPeriod", catalog = "data")
public class ConstructionPeriodPO implements Serializable {

	private static final long serialVersionUID = 2913775802699365242L;

	public static final String COLUMN_NAME_STR = "name";

	private long cpid;

	private String name;

	private short typeness;

	private int upperArea;

	private int lowerArea;

	private int period;

	private int company;

	public ConstructionPeriodPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "cpid")
	public long getCpid() {
		return cpid;
	}

	public void setCpid(long cpid) {
		this.cpid = cpid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "typeness")
	public short getTypeness() {
		return typeness;
	}

	public void setTypeness(short typeness) {
		this.typeness = typeness;
	}

	@Column(name = "upperArea")
	public int getUpperArea() {
		return upperArea;
	}

	public void setUpperArea(int upperArea) {
		this.upperArea = upperArea;
	}

	@Column(name = "lowerArea")
	public int getLowerArea() {
		return lowerArea;
	}

	public void setLowerArea(int lowerArea) {
		this.lowerArea = lowerArea;
	}

	@Column(name = "period")
	public int getPeriod() {
		return period;
	}

	public void setPeriod(int period) {
		this.period = period;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	public ConstructionPeriodVO ptv(ConstructionPeriodVO constructionPeriodVO) {

		BeanUtil.copyProperties(this, constructionPeriodVO, Arrays.asList(""));

		return constructionPeriodVO;
	}

}
