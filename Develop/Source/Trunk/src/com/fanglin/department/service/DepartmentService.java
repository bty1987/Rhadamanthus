/**
 * Title: DepartmentService
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.department.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.department.vo.DepartmentVO;
import com.fanglin.utils.Paging;

public interface DepartmentService {
	
	public void pageDepartment(Paging paging, List<FilterVO> filters, DepartmentVO departmentVO, int company) throws FLException;
	
	public void pageDepartmentByName(Paging paging, DepartmentVO departmentVO, int company);
	
	public List<DepartmentVO> queryDepartment(String type, int company) throws FLException;

	public DepartmentVO queryDepartmentById(String id);

}
