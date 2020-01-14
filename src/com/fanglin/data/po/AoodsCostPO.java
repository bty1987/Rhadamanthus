package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.construction.po.ConstructionCostPO;

@Entity
@Table(name = "aoodsCost", catalog = "data")
public class AoodsCostPO implements Serializable {

	private static final long serialVersionUID = -5976624753974911538L;

	private long acid;

	private AoodsPO aoods;

	private ConstructionCostPO constructionCost;

	private int numLimit;

	public AoodsCostPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "acid")
	public long getAcid() {
		return acid;
	}

	public void setAcid(long acid) {
		this.acid = acid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "aid", referencedColumnName = "aid")
	public AoodsPO getAoods() {
		return aoods;
	}

	public void setAoods(AoodsPO aoods) {
		this.aoods = aoods;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ccid", referencedColumnName = "ccid")
	public ConstructionCostPO getConstructionCost() {
		return constructionCost;
	}

	public void setConstructionCost(ConstructionCostPO constructionCost) {
		this.constructionCost = constructionCost;
	}

	@Column(name = "numLimit")
	public int getNumLimit() {
		return numLimit;
	}

	public void setNumLimit(int numLimit) {
		this.numLimit = numLimit;
	}

}
