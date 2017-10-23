package com.fanglin.report.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.report.po.MaterialDesignerDepartmentRankPO;

public interface MaterialDesignerDepartmentRankDao extends Dao<MaterialDesignerDepartmentRankPO> {
	
	public MaterialDesignerDepartmentRankPO queryMaterialDesignerDepartmentRankByDeptIdInit(String deptId,int company);
	
	public List<MaterialDesignerDepartmentRankPO> queryMaterialDesignerDepartmentRankForTop(int top,int company);

}
