package com.fanglin.salary.vo;

import java.io.Serializable;

import com.fanglin.personel.vo.UserBaseVO;

public class WorkerBalanceVO implements Serializable {

	private static final long serialVersionUID = 5454778312323725130L;

    private Long wbid;
	
	private UserBaseVO user;
	
	private Float deposit;
	
	private Float salary;
	
	private Float toplimit;
	
	private Short status;
	
	private Integer company;

	public WorkerBalanceVO(){
		super();
	}
	
	public WorkerBalanceVO(UserBaseVO user){
		super();
		this.user = user;
	}
	
	public Long getWbid() {
		return wbid;
	}

	public void setWbid(Long wbid) {
		this.wbid = wbid;
	}

	public UserBaseVO getUser() {
		return user;
	}

	public void setUser(UserBaseVO user) {
		this.user = user;
	}

	public Float getDeposit() {
		return deposit;
	}

	public void setDeposit(Float deposit) {
		this.deposit = deposit;
	}

	public Float getSalary() {
		return salary;
	}

	public void setSalary(Float salary) {
		this.salary = salary;
	}

	public Float getToplimit() {
		return toplimit;
	}

	public void setToplimit(Float toplimit) {
		this.toplimit = toplimit;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	} 
	
}
