/**
 * @File Name	: ConstructionVO.java
 * @Package   	: com.fanglin.vo.construction
 * @Version		: 1.0
 * @Date		: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.vo;

import java.io.Serializable;

import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.vo.UserBaseVO;

public class ConstructionVO implements Serializable{

	private static final long serialVersionUID = -6183413787236101280L;
	
	private Long cid;
	
	private String orderId;
	
	private DecorationVO decoration;
	
	private UserBaseVO supervisor;
	
	private String supervisorQualityName;
	
	private Integer schedule;
	
	private Short accessory;
	
	private Long accessoryLimit;
	
	private Long salaryLimit;
	
	private Long accessoryTotal;
	
	private Long salaryTotal;
	
	public ConstructionVO() {
		super();
	}
	
	public ConstructionVO(UserBaseVO supervisor) {
		super();
		this.supervisor = supervisor;
	}

	public ConstructionVO(DecorationVO decoration,UserBaseVO supervisor) {
		super();
		this.decoration = decoration;
		this.supervisor = supervisor;
	}
	
	public UserBaseVO getSupervisor() {
		return supervisor;
	}

	public void setSupervisor(UserBaseVO supervisor) {
		this.supervisor = supervisor;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public String getOrderId(){
		return orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}
	
	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public Integer getSchedule(){
		return schedule;
	}

	public void setSchedule(Integer schedule){
		this.schedule = schedule;
	}

	public String getSupervisorQualityName(){
		return supervisorQualityName;
	}

	public void setSupervisorQualityName(String supervisorQualityName){
		this.supervisorQualityName = supervisorQualityName;
	}

	public Short getAccessory() {
		return accessory;
	}

	public void setAccessory(Short accessory) {
		this.accessory = accessory;
	}

	public Long getAccessoryLimit() {
		return accessoryLimit;
	}

	public void setAccessoryLimit(Long accessoryLimit) {
		this.accessoryLimit = accessoryLimit;
	}

	public Long getSalaryLimit() {
		return salaryLimit;
	}

	public void setSalaryLimit(Long salaryLimit) {
		this.salaryLimit = salaryLimit;
	}

	public Long getAccessoryTotal() {
		return accessoryTotal;
	}

	public void setAccessoryTotal(Long accessoryTotal) {
		this.accessoryTotal = accessoryTotal;
	}

	public Long getSalaryTotal() {
		return salaryTotal;
	}

	public void setSalaryTotal(Long salaryTotal) {
		this.salaryTotal = salaryTotal;
	}
	
}
