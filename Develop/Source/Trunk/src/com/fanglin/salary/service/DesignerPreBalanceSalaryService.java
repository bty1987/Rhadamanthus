/**
 * @File Name		: DesignerPreBalanceSalaryService.java
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
import com.fanglin.salary.vo.DesignerPreBalanceSalaryVO;
import com.fanglin.utils.Paging;

public interface DesignerPreBalanceSalaryService {
	
	public void pageDesignerPreBalanceSalary(Paging paging, List<Filter> filters);
	
	public void addDesignerPreBalanceSalary(DesignerPreBalanceSalaryVO designerPreBalanceSalaryVO);
	
}
