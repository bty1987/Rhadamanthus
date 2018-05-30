/**
 * Title: DepartmentService
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface DepartmentService {
	
	public void pageDepartment(Paging paging, List<Filter> filters, DepartmentVO departmentVO, int company) throws FLException;
	
	public List<DepartmentVO> queryDepartment(DepartmentVO departmentVO, Integer company) throws FLException;

	public DepartmentVO queryDepartmentById(String id);
	
	public List<DepartmentVO> queryDepartmentByName(DepartmentVO departmentVO, int company);
	
	public void addDepartment(DepartmentVO departmentVO, String userId,int company) throws FLException;

	public void updateDepartment(DepartmentVO departmentVO) throws FLException;

	public void updateDepartmentForStatus(DepartmentVO departmentVO) throws FLException;

	public List<DepartmentVO> queryDepartmentByDtid(DepartmentVO departmentVO,int Company);
	
	

}
