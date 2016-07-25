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
	
	public List<DepartmentVO> queryDepartment(String type, int company) throws FLException;

	public DepartmentVO queryDepartmentById(String id);

	public void addDepartment(DepartmentVO departmentVO);
	
	public void updateDepartment(DepartmentVO departmentVO);

	public void deleteDepartment(List<String> ids);

	public void deleteDepartmentById(String id);
	
}
