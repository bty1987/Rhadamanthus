package com.fanglin.finance.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.department.po.DepartmentPO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "assistant", catalog = "finance")
public class AssistantPO implements java.io.Serializable {

	private static final long serialVersionUID = 8835242873351189639L;

	private long aid;
	
	private String orderId;
	
	private String orderAddr;
	
	private String msoNo;
	
	private DepartmentPO department;
	
	private UserPO user;
	
	private DepartmentPO designRegion;
	
	private DepartmentPO designDepartment;
	
	private UserPO designer;
	
	private DepartmentPO businessRegion;
	
	private DepartmentPO businessDepartment;
	
	private UserPO salesman;
	
	private DepartmentPO supervisDepartment;
	
	private UserPO supervisor;
	
	private DepartmentPO workDepartment;
	
	private UserPO worker;
	
	private DepartmentPO officeDepartment;
	
	private UserPO officer;
	
	private DepartmentPO materialDepartment;
	
	private UserPO materialer;
	
	private String brandName;
	
	private short company;

	public AssistantPO() {
		super();
	}

	public AssistantPO(String orderId, String orderAddr) {
		super();
		this.orderId = orderId;
		this.orderAddr = orderAddr;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "aId")
	public long getAid() {
		return this.aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return this.orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "orderAddr")
	public String getOrderAddr() {
		return orderAddr;
	}

	public void setOrderAddr(String orderAddr) {
		this.orderAddr = orderAddr;
	}

	@Column(name = "msoNo", length = 15)
	public String getMsoNo() {
		return this.msoNo;
	}

	public void setMsoNo(String msoNo) {
		this.msoNo = msoNo;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "departmentId", referencedColumnName = "dId")
	public DepartmentPO getDepartment() {
		return department;
	}

	public void setDepartment(DepartmentPO department) {
		this.department = department;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "userId", referencedColumnName = "uId")
	public UserPO getUser() {
		return user;
	}

	public void setUser(UserPO user) {
		this.user = user;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "designRegionId", referencedColumnName = "dId")
	public DepartmentPO getDesignRegion() {
		return designRegion;
	}

	public void setDesignRegion(DepartmentPO designRegion) {
		this.designRegion = designRegion;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "designDepartmentId", referencedColumnName = "dId")
	public DepartmentPO getDesignDepartment() {
		return designDepartment;
	}

	public void setDesignDepartment(DepartmentPO designDepartment) {
		this.designDepartment = designDepartment;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "designerId", referencedColumnName = "uId")
	public UserPO getDesigner() {
		return designer;
	}

	public void setDesigner(UserPO designer) {
		this.designer = designer;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "businessRegionId", referencedColumnName = "dId")
	public DepartmentPO getBusinessRegion() {
		return businessRegion;
	}

	public void setBusinessRegion(DepartmentPO businessRegion) {
		this.businessRegion = businessRegion;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "businessDepartmentId", referencedColumnName = "dId")
	public DepartmentPO getBusinessDepartment() {
		return businessDepartment;
	}

	public void setBusinessDepartment(DepartmentPO businessDepartment) {
		this.businessDepartment = businessDepartment;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "salesmanId", referencedColumnName = "uId")
	public UserPO getSalesman() {
		return salesman;
	}

	public void setSalesman(UserPO salesman) {
		this.salesman = salesman;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "supervisDepartmentId", referencedColumnName = "dId")
	public DepartmentPO getSupervisDepartment() {
		return supervisDepartment;
	}

	public void setSupervisDepartment(DepartmentPO supervisDepartment) {
		this.supervisDepartment = supervisDepartment;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "supervisorId", referencedColumnName = "uId")
	public UserPO getSupervisor() {
		return supervisor;
	}

	public void setSupervisor(UserPO supervisor) {
		this.supervisor = supervisor;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "workDepartmentId", referencedColumnName = "dId")
	public DepartmentPO getWorkDepartment() {
		return workDepartment;
	}

	public void setWorkDepartment(DepartmentPO workDepartment) {
		this.workDepartment = workDepartment;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "workerId", referencedColumnName = "uId")
	public UserPO getWorker() {
		return worker;
	}

	public void setWorker(UserPO worker) {
		this.worker = worker;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "officeDepartmentId", referencedColumnName = "dId")
	public DepartmentPO getOfficeDepartment() {
		return officeDepartment;
	}

	public void setOfficeDepartment(DepartmentPO officeDepartment) {
		this.officeDepartment = officeDepartment;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "officerId", referencedColumnName = "uId")
	public UserPO getOfficer() {
		return officer;
	}

	public void setOfficer(UserPO officer) {
		this.officer = officer;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "materialDepartmentId", referencedColumnName = "dId")
	public DepartmentPO getMaterialDepartment() {
		return materialDepartment;
	}

	public void setMaterialDepartment(DepartmentPO materialDepartment) {
		this.materialDepartment = materialDepartment;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "materialerId", referencedColumnName = "uId")
	public UserPO getMaterialer() {
		return materialer;
	}

	public void setMaterialer(UserPO materialer) {
		this.materialer = materialer;
	}

	@Column(name = "brandName")
	public String getBrandName() {
		return brandName;
	}

	public void setBrandName(String brandName) {
		this.brandName = brandName;
	}
	
	@Column(name = "company")
	public short getCompany() {
		return company;
	}

	public void setCompany(short company) {
		this.company = company;
	}

	public void setDesignInfo(UserPO desinger, DepartmentPO designDepartment, DepartmentPO designRegion){
		this.designer = desinger;
		this.designDepartment = designDepartment;
		this.designRegion = designRegion;
	}
	
	public void setBusinessInfo(UserPO salesman, DepartmentPO businessDepartment, DepartmentPO businessRegion){
		this.salesman = salesman;
		this.businessDepartment = businessDepartment;
		this.businessRegion = businessRegion;
	}
}