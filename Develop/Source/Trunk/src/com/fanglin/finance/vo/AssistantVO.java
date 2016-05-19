package com.fanglin.finance.vo;

import com.fanglin.department.vo.DepartmentVO;
import com.fanglin.personel.vo.UserVO;

public class AssistantVO implements java.io.Serializable {

	private static final long serialVersionUID = 504696877406482425L;

	private Long aid;
	
	private String orderId;
	
	private String orderAddr;
	
	private String msoNo;
	
	private DepartmentVO department;
	
	private UserVO user;
	
	private DepartmentVO designRegion;
	
	private DepartmentVO designDepartment;
	
	private UserVO designer;
	
	private DepartmentVO businessRegion;
	
	private DepartmentVO businessDepartment;
	
	private UserVO salesman;
	
	private DepartmentVO supervisDepartment;
	
	private UserVO supervisor;
	
	private DepartmentVO workDepartment;
	
	private UserVO worker;
	
	private DepartmentVO officeDepartment;
	
	private UserVO officer;
	
	private DepartmentVO materialDepartment;
	
	private UserVO materialer;
	
	private String brandName;
	
	private short company;
	
	public Long getAid() {
		return aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getOrderAddr() {
		return orderAddr;
	}

	public void setOrderAddr(String orderAddr) {
		this.orderAddr = orderAddr;
	}

	public String getMsoNo() {
		return msoNo;
	}

	public void setMsoNo(String msoNo) {
		this.msoNo = msoNo;
	}

	public DepartmentVO getDepartment() {
		return department;
	}

	public void setDepartment(DepartmentVO department) {
		this.department = department;
	}

	public UserVO getUser() {
		return user;
	}

	public void setUser(UserVO user) {
		this.user = user;
	}

	public DepartmentVO getDesignRegion() {
		return designRegion;
	}

	public void setDesignRegion(DepartmentVO designRegion) {
		this.designRegion = designRegion;
	}

	public DepartmentVO getDesignDepartment() {
		return designDepartment;
	}

	public void setDesignDepartment(DepartmentVO designDepartment) {
		this.designDepartment = designDepartment;
	}

	public UserVO getDesigner() {
		return designer;
	}

	public void setDesigner(UserVO designer) {
		this.designer = designer;
	}

	public DepartmentVO getBusinessRegion() {
		return businessRegion;
	}

	public void setBusinessRegion(DepartmentVO businessRegion) {
		this.businessRegion = businessRegion;
	}

	public DepartmentVO getBusinessDepartment() {
		return businessDepartment;
	}

	public void setBusinessDepartment(DepartmentVO businessDepartment) {
		this.businessDepartment = businessDepartment;
	}

	public UserVO getSalesman() {
		return salesman;
	}

	public void setSalesman(UserVO salesman) {
		this.salesman = salesman;
	}

	public DepartmentVO getSupervisDepartment() {
		return supervisDepartment;
	}

	public void setSupervisDepartment(DepartmentVO supervisDepartment) {
		this.supervisDepartment = supervisDepartment;
	}

	public UserVO getSupervisor() {
		return supervisor;
	}

	public void setSupervisor(UserVO supervisor) {
		this.supervisor = supervisor;
	}

	public DepartmentVO getWorkDepartment() {
		return workDepartment;
	}

	public void setWorkDepartment(DepartmentVO workDepartment) {
		this.workDepartment = workDepartment;
	}

	public UserVO getWorker() {
		return worker;
	}

	public void setWorker(UserVO worker) {
		this.worker = worker;
	}

	public DepartmentVO getOfficeDepartment() {
		return officeDepartment;
	}

	public void setOfficeDepartment(DepartmentVO officeDepartment) {
		this.officeDepartment = officeDepartment;
	}

	public UserVO getOfficer() {
		return officer;
	}

	public void setOfficer(UserVO officer) {
		this.officer = officer;
	}

	public DepartmentVO getMaterialDepartment() {
		return materialDepartment;
	}

	public void setMaterialDepartment(DepartmentVO materialDepartment) {
		this.materialDepartment = materialDepartment;
	}

	public UserVO getMaterialer() {
		return materialer;
	}

	public void setMaterialer(UserVO materialer) {
		this.materialer = materialer;
	}

	public String getBrandName() {
		return brandName;
	}

	public void setBrandName(String brandName) {
		this.brandName = brandName;
	}
	
	public short getCompany() {
		return company;
	}

	public void setCompany(short company) {
		this.company = company;
	}

}