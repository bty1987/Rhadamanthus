package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.DepartmentTypePO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface DepartmentTypeDao extends Dao<DepartmentTypePO> {

	public List<DepartmentTypePO> pageDepartmentType(Paging paging, List<Filter> filters);

	public List<DepartmentTypePO> queryDepartmentType();

	public DepartmentTypePO queryDepartmentTypeByName(String name);

}
