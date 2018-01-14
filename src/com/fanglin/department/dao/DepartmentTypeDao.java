package com.fanglin.department.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.department.po.DepartmentTypePO;
import com.fanglin.utils.Paging;

public interface DepartmentTypeDao extends Dao<DepartmentTypePO> {

	public List<DepartmentTypePO> pageDepartmentType(Paging paging, List<Filter> filters);
	
	public List<DepartmentTypePO> queryDepartmentType();
	
	public DepartmentTypePO queryDepartmentTypeByName(String name);
	
}
