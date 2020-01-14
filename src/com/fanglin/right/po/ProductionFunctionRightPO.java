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

import com.fanglin.production.po.ProductionFunctionPO;

@Entity
@Table(name = "productionfunctionright", catalog = "platform")
public class ProductionFunctionRightPO implements Serializable {

	private static final long serialVersionUID = -565492413799408188L;

	private long pfrid;

	private String name;

	private ProductionFunctionPO productionFunction;

	private int company;

	@Id
	@GeneratedValue
	@Column(name = "pfrid")
	public long getPfrid() {
		return pfrid;
	}

	public void setPfrid(long pfrid) {
		this.pfrid = pfrid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "pfid", referencedColumnName = "pfid")
	public ProductionFunctionPO getProductionFunction() {
		return productionFunction;
	}

	public void setProductionFunction(ProductionFunctionPO productionFunction) {
		this.productionFunction = productionFunction;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}
	
	public void setCompany(int company) {
		this.company = company;
	}
	
}
