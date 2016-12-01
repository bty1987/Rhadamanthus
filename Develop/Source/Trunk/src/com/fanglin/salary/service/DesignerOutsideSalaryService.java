/**
 * @File Name		: DesignerOutsideSalaryService.java
 * @Package   	: com.fanglin.service.salary
 * @Version		: 1.0
 * @Date			: 2014-11-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.salary.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.salary.vo.DesignerOutsideSalaryVO;
import com.fanglin.utils.Paging;

public interface DesignerOutsideSalaryService {
	
	public void pageDesignerOutsideSalary(Paging paging, List<Filter> filters);
	
	public void addDesignerOutsideSalary(DesignerOutsideSalaryVO designerOutsideSalaryVO);

}
