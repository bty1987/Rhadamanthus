package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.data.common.vo.ConstructionPaceVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "constructionpace", catalog = "data")
public class ConstructionPacePO implements Serializable {

	private static final long serialVersionUID = -2961980546754432491L;

	public static final String COLUMN_NAME_STR = "name";

	private long cpid;

	private String name;

	private short typeness;

	private int upperArea;

	private int lowerArea;

	private int period;

	private int designPeriod;

	private int company;

	public ConstructionPacePO() {
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

	@Column(name = "designPeriod")
	public int getDesignPeriod() {
		return designPeriod;
	}

	public void setDesignPeriod(int designPeriod) {
		this.designPeriod = designPeriod;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	public ConstructionPaceVO ptv(ConstructionPaceVO constructionPaceVO) {

		BeanUtil.copyProperties(this, constructionPaceVO, Arrays.asList(""));

		return constructionPaceVO;
	}

}
