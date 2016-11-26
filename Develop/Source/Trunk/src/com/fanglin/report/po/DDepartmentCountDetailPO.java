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
@Table(name = "ddepartmentcountdetail", catalog = "report")
public class DDepartmentCountDetailPO implements java.io.Serializable {

	private static final long serialVersionUID = 7500316305714817316L;
	
	public static final String COLUMN_DESIGN_DEPTID_STR = "designDepartment.deptId";
	
	public static final String COLUMN_SALESMAN_DEPTID_STR = "salesmanDepartment.deptId";
	
	public static final String COLUMN_CREATEDATE_STR = "createDate";
	
	private long ddcdId;
	
	private DepartmentPO designDepartment;
	
	private DepartmentPO salesmanDepartment;
	
	private float createNum;
	
	private float signNum;
	
	private float contractPrice;
	
	private Date createDate;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "ddcdId")
	public long getDdcdId() {
		return this.ddcdId;
	}

	public void setDdcdId(long ddcdId) {
		this.ddcdId = ddcdId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "ddId", referencedColumnName="dId")
	public DepartmentPO getDesignDepartment() {
		return designDepartment;
	}

	public void setDesignDepartment(DepartmentPO designDepartment) {
		this.designDepartment = designDepartment;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "sdId", referencedColumnName="dId")
	public DepartmentPO getSalesmanDepartment() {
		return salesmanDepartment;
	}

	public void setSalesmanDepartment(DepartmentPO salesmanDepartment) {
		this.salesmanDepartment = salesmanDepartment;
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