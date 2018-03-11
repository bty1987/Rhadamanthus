package com.fanglin.finance.vo;

import com.fanglin.department.po.DepartmentPO;
import com.fanglin.department.vo.DepartmentVO;
import com.fanglin.finance.po.AssistantPO;
import com.fanglin.finance.po.AssistantTmpPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;

public class AssistantVO implements java.io.Serializable {

	private static final long serialVersionUID = 504696877406482425L;

	private Long aid;
	
	private String orderId;
	
	private String orderAddr;
	
	private String no;
	
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
	
	private String brand;
	
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

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
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

	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}
	
	public short getCompany() {
		return company;
	}

	public void setCompany(short company) {
		this.company = company;
	}

	public AssistantPO packageFromVOToPO(){
		
		AssistantPO assistantPO = new AssistantPO();
		
		assistantPO.setOrderId(getOrderId());
		assistantPO.setOrderAddr(getOrderAddr());
		assistantPO.setNo(getNo());
		assistantPO.setBrand(getBrand());
		assistantPO.setCompany(getCompany());
		
		if(getDepartment() != null && getDepartment().getDid() != 0){
			assistantPO.setDepartment(new DepartmentPO(getDepartment().getDid()));
		}
		
		if(getUser() != null && getUser().getUid() != 0){
			assistantPO.setUser(new UserPO(getUser().getUid()));
		}
		
		if(getDesigner() != null && getDesigner().getUid() != 0){
			assistantPO.setDesigner(new UserPO(getDesigner().getUid()));
		}
		
		if(getDesignDepartment() != null && getDesignDepartment().getDid() != 0){
			assistantPO.setDesignDepartment(new DepartmentPO(getDesignDepartment().getDid()));
		}
		
		if(getDesignRegion() != null && getDesignRegion().getDid() != 0){
			assistantPO.setDesignRegion(new DepartmentPO(getDesignRegion().getDid()));
		}
		
		if(getSalesman() != null && getSalesman().getUid() != 0){
			assistantPO.setSalesman(new UserPO(getSalesman().getUid()));
		}
		
		if(getBusinessDepartment() != null && getBusinessDepartment().getDid() != 0){
			assistantPO.setBusinessDepartment(new DepartmentPO(getBusinessDepartment().getDid()));
		}
		
		if(getBusinessRegion() != null && getBusinessRegion().getDid() != 0){
			assistantPO.setBusinessRegion(new DepartmentPO(getBusinessRegion().getDid()));
		}
		
		if(getSupervisor() != null && getSupervisor().getUid() != 0){
			assistantPO.setSupervisor(new UserPO(getSupervisor().getUid()));
		}
		
		if(getSupervisDepartment() != null && getSupervisDepartment().getDid() != 0){
			assistantPO.setSupervisDepartment(new DepartmentPO(getSupervisDepartment().getDid()));
		}
		
		if(getWorker() != null && getWorker().getUid() != 0){
			assistantPO.setWorker(new UserPO(getWorker().getUid()));
		}
		
		if(getWorkDepartment() != null && getWorkDepartment().getDid() != 0){
			assistantPO.setWorkDepartment(new DepartmentPO(getWorkDepartment().getDid()));
		}
		
		if(getOfficer() != null && getOfficer().getUid() != 0){
			assistantPO.setOfficer(new UserPO(getOfficer().getUid()));
		}
		
		if(getOfficeDepartment() != null && getOfficeDepartment().getDid() != 0){
			assistantPO.setOfficeDepartment(new DepartmentPO(getOfficeDepartment().getDid()));
		}
		
		if(getMaterialer() != null && getMaterialer().getUid() != 0){
			assistantPO.setMaterialer(new UserPO(getMaterialer().getUid()));
		}
		
		if(getMaterialDepartment() != null && getMaterialDepartment().getDid() != 0){
			assistantPO.setMaterialDepartment(new DepartmentPO(getMaterialDepartment().getDid()));
		}
		
		return assistantPO;
	}
	
	public AssistantTmpPO packageFromVOToTmp(){
		
		AssistantTmpPO assistantPO = new AssistantTmpPO();
		
		assistantPO.setOrderId(getOrderId());
		assistantPO.setOrderAddr(getOrderAddr());
		assistantPO.setNo(getNo());
		assistantPO.setBrand(getBrand());
		assistantPO.setCompany(getCompany());
		
		if(getDepartment() != null && getDepartment().getDid() != 0){
			assistantPO.setDepartment(new DepartmentPO(getDepartment().getDid()));
		}
		
		if(getUser() != null && getUser().getUid() != 0){
			assistantPO.setUser(new UserPO(getUser().getUid()));
		}
		
		if(getDesigner() != null && getDesigner().getUid() != 0){
			assistantPO.setDesigner(new UserPO(getDesigner().getUid()));
		}
		
		if(getDesignDepartment() != null && getDesignDepartment().getDid() != 0){
			assistantPO.setDesignDepartment(new DepartmentPO(getDesignDepartment().getDid()));
		}
		
		if(getDesignRegion() != null && getDesignRegion().getDid() != 0){
			assistantPO.setDesignRegion(new DepartmentPO(getDesignRegion().getDid()));
		}
		
		if(getSalesman() != null && getSalesman().getUid() != 0){
			assistantPO.setSalesman(new UserPO(getSalesman().getUid()));
		}
		
		if(getBusinessDepartment() != null && getBusinessDepartment().getDid() != 0){
			assistantPO.setBusinessDepartment(new DepartmentPO(getBusinessDepartment().getDid()));
		}
		
		if(getBusinessRegion() != null && getBusinessRegion().getDid() != 0){
			assistantPO.setBusinessRegion(new DepartmentPO(getBusinessRegion().getDid()));
		}
		
		if(getSupervisor() != null && getSupervisor().getUid() != 0){
			assistantPO.setSupervisor(new UserPO(getSupervisor().getUid()));
		}
		
		if(getSupervisDepartment() != null && getSupervisDepartment().getDid() != 0){
			assistantPO.setSupervisDepartment(new DepartmentPO(getSupervisDepartment().getDid()));
		}
		
		if(getWorker() != null && getWorker().getUid() != 0){
			assistantPO.setWorker(new UserPO(getWorker().getUid()));
		}
		
		if(getWorkDepartment() != null && getWorkDepartment().getDid() != 0){
			assistantPO.setWorkDepartment(new DepartmentPO(getWorkDepartment().getDid()));
		}
		
		if(getOfficer() != null && getOfficer().getUid() != 0){
			assistantPO.setOfficer(new UserPO(getOfficer().getUid()));
		}
		
		if(getOfficeDepartment() != null && getOfficeDepartment().getDid() != 0){
			assistantPO.setOfficeDepartment(new DepartmentPO(getOfficeDepartment().getDid()));
		}
		
		if(getMaterialer() != null && getMaterialer().getUid() != 0){
			assistantPO.setMaterialer(new UserPO(getMaterialer().getUid()));
		}
		
		if(getMaterialDepartment() != null && getMaterialDepartment().getDid() != 0){
			assistantPO.setMaterialDepartment(new DepartmentPO(getMaterialDepartment().getDid()));
		}
		
		return assistantPO;
	}

}