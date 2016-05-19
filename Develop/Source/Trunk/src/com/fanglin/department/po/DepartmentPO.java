/**
 * Title: DepartmentPO
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author Howard
 *
 */

package com.fanglin.department.po;

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

import com.fanglin.system.po.CityProperPO;

@Entity
@Table(name = "department", catalog = "communion")
public class DepartmentPO implements Serializable {

	private static final long serialVersionUID = -7371170236257562586L;
	
	private int dId;

	private String deptId;
	
	private String deptName;
	
	private String type;
	
	private String subType;
	
	private String createTime;
	
	private String des;
	
	private String contractPrefix;

	private DepartmentPO fatherDept;
	
	private CityProperPO cityProper;
	
	private int company;
	
	public DepartmentPO(){
		super();
	}
	
	public DepartmentPO(String deptId) {
		super();
		this.deptId = deptId;
	}

	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "dId") 
	public int getdId() {
		return dId;
	}

	public void setdId(int dId) {
		this.dId = dId;
	}

	@Id
	@Column(nullable = false)
	public String getDeptId(){
		return deptId;
	}

	public void setDeptId(String deptId){
		this.deptId = deptId;
	}

	@Column(nullable = false)
	public String getDeptName(){
		return deptName;
	}

	public void setDeptName(String deptName){
		this.deptName = deptName;
	}

	@Column(nullable = false)
	public String getType(){
		return type;
	}

	public void setType(String type){
		this.type = type;
	}

	public String getSubType(){
		return subType;
	}

	public void setSubType(String subType){
		this.subType = subType;
	}

	@Column(nullable = false)
	public String getCreateTime(){
		return createTime;
	}

	public void setCreateTime(String createTime){
		this.createTime = createTime;
	}

	public String getDes(){
		return des;
	}

	public void setDes(String des){
		this.des = des;
	}

	public String getContractPrefix(){
		return contractPrefix;
	}

	public void setContractPrefix(String contractPrefix){
		this.contractPrefix = contractPrefix;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "fatherDeptId", referencedColumnName = "deptId")
	public DepartmentPO getFatherDept(){
		return fatherDept;
	}

	public void setFatherDept(DepartmentPO fatherDept){
		this.fatherDept = fatherDept;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cityProperId", referencedColumnName = "cityProperId")
	public CityProperPO getCityProper(){
		return cityProper;
	}

	public void setCityProper(CityProperPO cityProper){
		this.cityProper = cityProper;
	}

	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
