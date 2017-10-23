package com.fanglin.report.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.po.MaterialDesignerDepartmentCountPO;

public interface MaterialDesignerDepartmentCountDao extends Dao<MaterialDesignerDepartmentCountPO> {
	
	public MaterialDesignerDepartmentCountPO queryMaterialDesignerDepartmentCountByDeptIdTime(String deptId, String time);
	
	public List<MaterialDesignerDepartmentCountPO> queryMaterialDesignerDepartmentCount(List<Filter> filters);
	
	public List<Object> countMaterialDesignerDepartmentCount(List<Filter> filters);
	
}
