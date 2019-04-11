package com.fanglin.salary.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.salary.vo.SalaryVO;
import com.fanglin.utils.Paging;

public interface SalaryService {

	public void pageSalary(Paging paging,List<Filter> filters);
	
	public int addSalary(SalaryVO salaryVO);
	
	public int passSalary(SalaryVO salaryVO,String userId) throws FLException;
	
	public int rejectSalary(SalaryVO salaryVO,String userId) throws FLException;
	
	public int cancelSalary(SalaryVO salaryVO,String userId) throws FLException;
	
}
