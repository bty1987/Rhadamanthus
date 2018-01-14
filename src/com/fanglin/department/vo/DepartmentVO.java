/**
 * Title: DepartmentVO
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.department.vo;

import java.io.Serializable;

import com.fanglin.department.po.DepartmentPO;
import com.fanglin.system.vo.CityProperVO;

public class DepartmentVO implements Serializable {

	private static final long serialVersionUID = -7371170236257562586L;
	
	private int did;

	private String deptId;
	
	private String deptName;
	
	private DepartmentTypeVO type;
	
	private String subType;
	
	private String createTime;
	
	private String des;
	
	private String contractPrefix;

	private DepartmentVO fatherDept;
	
	private CityProperVO cityProper;
	
	private Integer ident;
	
	private Short status;
	
	
	
	public DepartmentVO(){
		super();
	}

	
	public DepartmentVO(DepartmentTypeVO type, DepartmentVO fatherDept,CityProperVO cityProper) {
		this.type = type;
		this.fatherDept = fatherDept;
		this.cityProper = cityProper;
	}


	public int getDid() {
		return did;
	}

	public void setDid(int did) {
		this.did = did;
	}

	public String getDeptId() {
		return deptId;
	}

	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}

	public String getDeptName(){
		return deptName;
	}

	public void setDeptName(String deptName){
		this.deptName = deptName;
	}

	public DepartmentTypeVO getType(){
		return type;
	}

	public void setType(DepartmentTypeVO type){
		this.type = type;
	}

	public String getSubType(){
		return subType;
	}

	public void setSubType(String subType){
		this.subType = subType;
	}

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


//	public DepartmentTypeVO getFatherDept() {
//		return fatherDept;
//	}
//
//	public void setFatherDept(DepartmentTypeVO fatherDept) {
//		this.fatherDept = fatherDept;
//	}
	
	
	

	public CityProperVO getCityProper(){
		return cityProper;
	}

	public DepartmentVO getFatherDept() {
		return fatherDept;
	}

	public void setFatherDept(DepartmentVO fatherDept) {
		this.fatherDept = fatherDept;
	}

	public void setCityProper(CityProperVO cityProper){
		this.cityProper = cityProper;
	}

	public Integer getIdent() {
		return ident;
	}

	public void setIdent(Integer ident) {
		this.ident = ident;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public DepartmentVO setBaseInfo(DepartmentPO departmentPO){
		this.did = departmentPO.getDid();
		this.deptId = departmentPO.getDeptId();
		this.deptName = departmentPO.getDeptName();
		
		return this;
	}

}
