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

import com.fanglin.system.vo.CityProperVO;

public class DepartmentVO implements Serializable {

	private static final long serialVersionUID = -7371170236257562586L;
	
	private Integer dId;

	private String deptId;
	
	private String deptName;
	
	private String type;
	
	private String subType;
	
	private String createTime;
	
	private String des;
	
	private String contractPrefix;

	private DepartmentVO fatherDept;
	
	private CityProperVO cityProper;
	
	private int ident;
	
	private int company;
	
	public DepartmentVO(){
		super();
	}

	public Integer getDid() {
		return dId;
	}

	public void setDid(Integer dId) {
		this.dId = dId;
	}

	public String getDeptId(){
		return deptId;
	}

	public void setDeptId(String deptId){
		this.deptId = deptId;
	}

	public String getDeptName(){
		return deptName;
	}

	public void setDeptName(String deptName){
		this.deptName = deptName;
	}

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

	public DepartmentVO getFatherDept(){
		return fatherDept;
	}

	public void setFatherDept(DepartmentVO fatherDept){
		this.fatherDept = fatherDept;
	}

	public CityProperVO getCityProper(){
		return cityProper;
	}

	public void setCityProper(CityProperVO cityProper){
		this.cityProper = cityProper;
	}

	public int getIdent() {
		return ident;
	}

	public void setIdent(int ident) {
		this.ident = ident;
	}

	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
