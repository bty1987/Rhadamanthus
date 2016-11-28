package com.fanglin.report.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fanglin.department.po.DepartmentPO;

@Entity
@Table(name = "dregioncountdetail", catalog = "report")
public class DRegionCountDetailPO implements java.io.Serializable {

	private static final long serialVersionUID = -7346601311002659577L;
	
	public static final String COLUMN_DESIGN_DEPTID_STR = "designRegion.deptId";
	
	public static final String COLUMN_SALESMAN_DEPTID_STR = "salesmanRegion.deptId";
	
	public static final String COLUMN_CREATEDATE_STR = "createDate";

	private long drcdId;
	
	private DepartmentPO designRegion;
	
	private DepartmentPO salesmanRegion;
	
	private float createNum;
	
	private float signNum;
	
	private float contractPrice;
	
	private Date createDate;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "drcdId")
	public long getDrcdId() {
		return this.drcdId;
	}

	public void setDrcdId(long drcdId) {
		this.drcdId = drcdId;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(nullable = true, name = "ddId", referencedColumnName="dId")
	public DepartmentPO getDesignRegion() {
		return designRegion;
	}

	public void setDesignRegion(DepartmentPO designRegion) {
		this.designRegion = designRegion;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(nullable = true, name = "sdId", referencedColumnName="dId")
	public DepartmentPO getSalesmanRegion() {
		return salesmanRegion;
	}

	public void setSalesmanRegion(DepartmentPO salesmanRegion) {
		this.salesmanRegion = salesmanRegion;
	}

	@Column(name = "createNum")
	public float getCreateNum() {
		return this.createNum;
	}

	public void setCreateNum(float createNum) {
		this.createNum = createNum;
	}

	@Column(name = "signNum")
	public float getSignNum() {
		return this.signNum;
	}

	public void setSignNum(float signNum) {
		this.signNum = signNum;
	}

	@Column(name = "contractPrice")
	public float getContractPrice() {
		return this.contractPrice;
	}

	public void setContractPrice(float contractPrice) {
		this.contractPrice = contractPrice;
	}

	@Temporal(TemporalType.DATE)
	@Column(name = "createDate")
	public Date getCreateDate() {
		return this.createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

}