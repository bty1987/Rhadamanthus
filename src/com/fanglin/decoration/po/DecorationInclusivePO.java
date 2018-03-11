package com.fanglin.decoration.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;


@Entity
@Table(name = "decorationinclusive", catalog = "decoration")
public class DecorationInclusivePO implements java.io.Serializable {

	private static final long serialVersionUID = -301890437525155657L;

	public static final String COLUMN_ORDERID_STR = "decoration.orderId";
	
	public static final String COLUMN_VILLAGE_STR = "village.name";
	
	public static final String COLUMN_DESIGNER_STR = "designer.userId";

	public static final String COLUMN_COMPANY_STR = "decoration.no";
	
	public static final float MONEY_ZERO_FLOAT = 0f;
	
	public static final short STATUS_INIT_SHORT = 0;
	
	private long diid;
	
	private DecorationPO decoration;
	
	private float contractPrice;
	
	private float projectPrice;
		
	private float cdiff;	
		
	private float mdiff;
	
	private float managePrice;	
	
	private float manageRate;	

	private float materialPaidup;
	
	public DecorationInclusivePO() {
		super();
	}

	public DecorationInclusivePO(DecorationPO decoration) {
		super();
		this.decoration = decoration;
	}
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "dIid")
	public long getDiid() {
		return diid;
	}

	public void setDiid(long diid) {
		this.diid = diid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "orderId", referencedColumnName="orderId")
	public DecorationPO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationPO decoration) {
		this.decoration = decoration;
	}
	
	@Column(name = "contractPrice")
	public float getContractPrice() {
		return contractPrice;
	}

	public void setContractPrice(float contractPrice) {
		this.contractPrice = contractPrice;
	}
	
	@Column(name = "projectPrice")
	public float getProjectPrice() {
		return projectPrice;
	}

	public void setProjectPrice(float projectPrice) {
		this.projectPrice = projectPrice;
	}
	
	@Column(name = "cdiff")
	public float getCdiff() {
		return cdiff;
	}

	public void setCdiff(float cdiff) {
		this.cdiff = cdiff;
	}
	
	@Column(name = "mdiff")
	public float getMdiff() {
		return mdiff;
	}

	public void setMdiff(float mdiff) {
		this.mdiff = mdiff;
	}
	
	@Column(name = "managePrice")
	public float getManagePrice() {
		return managePrice;
	}

	public void setManagePrice(float managePrice) {
		this.managePrice = managePrice;
	}
	
	@Column(name = "manageRate")
	public float getManageRate() {
		return manageRate;
	}

	public void setManageRate(float manageRate) {
		this.manageRate = manageRate;
	}
	
	@Column(name = "materialPaidup")
	public float getMaterialPaidup() {
		return materialPaidup;
	}

	public void setMaterialPaidup(float materialPaidup) {
		this.materialPaidup = materialPaidup;
	}




}