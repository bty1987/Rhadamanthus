package com.fanglin.report.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.po.MaterialDepartmentCountPO;

public interface MaterialDepartmentCountDao extends Dao<MaterialDepartmentCountPO> {
	
	public MaterialDepartmentCountPO queryMaterialDepartmentCountByDeptIdTime(String deptId, String time);
	
	public List<MaterialDepartmentCountPO> queryMaterialDepartmentCount(List<Filter> filters);
	
}
