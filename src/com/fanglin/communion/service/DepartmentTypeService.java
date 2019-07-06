package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.DepartmentTypeVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface DepartmentTypeService {

	public void pageDepartmentType(Paging paging, List<Filter> filters);

	public void addDepartmentType(DepartmentTypeVO departmenttypevo);

	public List<DepartmentTypeVO> queryDepartmentType();
}
