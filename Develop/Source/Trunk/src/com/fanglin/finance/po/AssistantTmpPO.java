package com.fanglin.finance.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.department.po.DepartmentPO;
import com.fanglin.department.vo.DepartmentVO;
import com.fanglin.finance.vo.AssistantVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "assistanttmp", catalog = "finance")
public class AssistantTmpPO implements java.io.Serializable {

	private static final long serialVersionUID = 6755237171979927592L;

	private int atId;
	
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

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "atId")
	public int getAtId() {
		return this.atId;
	}

	public void setAtId(int atId) {
		this.atId = atId;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return this.orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "msoNo")
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

	@Column(name = "orderAddr")
	public String getOrderAddr() {
		return this.orderAddr;
	}

	public void setOrderAddr(String orderAddr) {
		this.orderAddr = orderAddr;
	}

	@Column(name = "brandName")
	public String getBrandName() {
		return this.brandName;
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
	
	public AssistantPO packageFromTmpToPO(){
		
		AssistantPO assistantPO = new AssistantPO();
		
		assistantPO.setOrderId(getOrderId());
		assistantPO.setOrderAddr(getOrderAddr());
		assistantPO.setMsoNo(getMsoNo());
		assistantPO.setBrandName(getBrandName());
		
		if(getDesigner() != null){
			assistantPO.setDesigner(getDesigner());
		}
		
		if(getDesignDepartment() != null){
			assistantPO.setDesignDepartment(getDesignDepartment());
		}
		
		if(getDesignRegion() != null){
			assistantPO.setDesignRegion(getDesignRegion());
		}
		
		if(getSalesman() != null){
			assistantPO.setSalesman(getSalesman());
		}
		
		if(getBusinessDepartment() != null){
			assistantPO.setBusinessDepartment(getBusinessDepartment());
		}
		
		if(getBusinessRegion() != null){
			assistantPO.setBusinessRegion(getBusinessRegion());
		}
		
		if(getSupervisor() != null){
			assistantPO.setSupervisor(getSupervisor());
		}
		
		if(getSupervisDepartment() != null){
			assistantPO.setSupervisDepartment(getSupervisDepartment());
		}
		
		if(getWorker() != null){
			assistantPO.setWorker(getWorker());
		}
		
		if(getWorkDepartment() != null){
			assistantPO.setWorkDepartment(getWorkDepartment());
		}
		
		if(getOfficer() != null){
			assistantPO.setOfficer(getOfficer());
		}
		
		if(getOfficeDepartment() != null){
			assistantPO.setOfficeDepartment(getOfficeDepartment());
		}
		
		if(getMaterialer() != null){
			assistantPO.setMaterialer(getMaterialer());
		}
		
		if(getMaterialDepartment() != null){
			assistantPO.setMaterialDepartment(getMaterialDepartment());
		}
		
		return assistantPO;
	}

	public AssistantVO packageFromTmpToVO(){
		AssistantVO assistantVO = new AssistantVO();
		
		assistantVO.setOrderId(getOrderId());
		assistantVO.setOrderAddr(getOrderAddr());
		assistantVO.setMsoNo(getMsoNo());
		assistantVO.setBrandName(getBrandName());
		assistantVO.setCompany(getCompany());
		
		if(getDepartment() != null){
			assistantVO.setDepartment(new DepartmentVO());
			BeanUtil.copyProperties(getDepartment(), assistantVO.getDepartment(), Arrays.asList("deptId", "fatherDept", "cityProper"));
		}
		
		if(getDesigner() != null){
			assistantVO.setUser(new UserVO());
			BeanUtil.copyProperties(getUser(), assistantVO.getUser(), Arrays.asList("role", "dept", "password"));
		}
		
		if(getDesigner() != null){
			assistantVO.setDesigner(new UserVO());
			BeanUtil.copyProperties(getDesigner(), assistantVO.getDesigner(), Arrays.asList("role", "dept", "password"));
		}
		
		if(getDesignDepartment() != null){
			assistantVO.setDesignDepartment(new DepartmentVO());
			BeanUtil.copyProperties(getDesignDepartment(), assistantVO.getDesignDepartment(), Arrays.asList("deptId", "fatherDept", "cityProper"));
		}
		
		if(getDesignRegion() != null){
			assistantVO.setDesignRegion(new DepartmentVO());
			BeanUtil.copyProperties(getDesignRegion(), assistantVO.getDesignRegion(), Arrays.asList("deptId", "fatherDept", "cityProper"));
		}
		
		if(getSalesman() != null){
			assistantVO.setSalesman(new UserVO());
			BeanUtil.copyProperties(getSalesman(), assistantVO.getSalesman(), Arrays.asList("role", "dept", "password"));
		}
		
		if(getBusinessDepartment() != null){
			assistantVO.setBusinessDepartment(new DepartmentVO());
			BeanUtil.copyProperties(getBusinessDepartment(), assistantVO.getBusinessDepartment(), Arrays.asList("deptId", "fatherDept", "cityProper"));
		}
		
		if(getBusinessRegion() != null){
			assistantVO.setBusinessRegion(new DepartmentVO());
			BeanUtil.copyProperties(getBusinessRegion(), assistantVO.getBusinessRegion(), Arrays.asList("deptId", "fatherDept", "cityProper"));
		}
		
		if(getSupervisor() != null){
			assistantVO.setSupervisor(new UserVO());
			BeanUtil.copyProperties(getSupervisor(), assistantVO.getSupervisor(), Arrays.asList("role", "dept", "password"));
		}
		
		if(getSupervisDepartment() != null){
			assistantVO.setSupervisDepartment(new DepartmentVO());
			BeanUtil.copyProperties(getSupervisDepartment(), assistantVO.getSupervisDepartment(), Arrays.asList("deptId", "fatherDept", "cityProper"));
		}
		
		if(getWorker() != null){
			assistantVO.setWorker(new UserVO());
			BeanUtil.copyProperties(getWorker(), assistantVO.getWorker(), Arrays.asList("role", "dept", "password"));
		}
		
		if(getWorkDepartment() != null){
			assistantVO.setWorkDepartment(new DepartmentVO());
			BeanUtil.copyProperties(getWorkDepartment(), assistantVO.getWorkDepartment(), Arrays.asList("deptId", "fatherDept", "cityProper"));
		}
		
		if(getOfficer() != null){
			assistantVO.setOfficer(new UserVO());
			BeanUtil.copyProperties(getOfficer(), assistantVO.getOfficer(), Arrays.asList("role", "dept", "password"));
		}
		
		if(getOfficeDepartment() != null){
			assistantVO.setOfficeDepartment(new DepartmentVO());
			BeanUtil.copyProperties(getOfficeDepartment(), assistantVO.getOfficeDepartment(), Arrays.asList("deptId", "fatherDept", "cityProper"));
		}
		
		if(getMaterialer() != null){
			assistantVO.setMaterialer(new UserVO());
			BeanUtil.copyProperties(getMaterialer(), assistantVO.getMaterialer(), Arrays.asList("role", "dept", "password"));
		}
		
		if(getMaterialDepartment() != null){
			assistantVO.setMaterialDepartment(new DepartmentVO());
			BeanUtil.copyProperties(getMaterialDepartment(), assistantVO.getMaterialDepartment(), Arrays.asList("deptId", "fatherDept", "cityProper"));
		}
		
		return assistantVO;
	}
	
}