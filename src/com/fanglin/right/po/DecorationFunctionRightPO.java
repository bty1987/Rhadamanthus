package com.fanglin.right.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.decoration.po.DecorationFunctionPO;

@Entity
@Table(name = "decorationfunctionright", catalog = "platform")
public class DecorationFunctionRightPO implements Serializable {

	private static final long serialVersionUID = -565492413799408188L;

	private long dfrid;

	private String name;

	private DecorationFunctionPO decorationFunction;

	private int company;

	@Id
	@GeneratedValue
	@Column(name = "dfrid")
	public long getDfrid() {
		return dfrid;
	}

	public void setDfrid(long dfrid) {
		this.dfrid = dfrid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "dfid", referencedColumnName = "dfid")
	public DecorationFunctionPO getDecorationFunction() {
		return decorationFunction;
	}

	public void setDecorationFunction(DecorationFunctionPO decorationFunction) {
		this.decorationFunction = decorationFunction;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
