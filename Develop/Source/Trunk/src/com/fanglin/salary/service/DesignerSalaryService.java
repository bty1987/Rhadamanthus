/**
 * @File Name		: DesignerSalaryService.java
 * @Package   	: com.fanglin.service.salary
 * @Version		: 1.0
 * @Date			: 2014-10-31
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.salary.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.salary.vo.DesignerSalaryVO;
import com.fanglin.utils.Paging;

public interface DesignerSalaryService {
	
	public void pageDesignerSalary(Paging paging, List<Filter> filters);
	
	public void pageDesignerSalaryForInit(Paging paging, List<Filter> filters);
	
	public void pageDesignerSalaryForPayOff(Paging paging, List<Filter> filters);
	
	public void pageDesignerSalaryForUnPayOff(Paging paging, List<Filter> filters);
	
	public void payDesignerSalary();
	
	public void payoffDesignerSalary(DesignerSalaryVO designerSalaryVO);
	
	public void unpayoffDesignerSalary(DesignerSalaryVO designerSalaryVO);

}
