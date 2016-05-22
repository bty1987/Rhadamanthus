/**
 * @File Name		: DesignerPostBalanceSalaryService.java
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

import com.fanglin.core.vo.FilterVO;
import com.fanglin.salary.vo.DesignerPostBalanceSalaryVO;
import com.fanglin.utils.Paging;

public interface DesignerPostBalanceSalaryService {
	
	public void pageDesignerPostBalanceSalary(Paging paging, List<FilterVO> filters);
	
	public void addDesignerPostBalanceSalary(DesignerPostBalanceSalaryVO designerPostBalanceSalaryVO);

}
