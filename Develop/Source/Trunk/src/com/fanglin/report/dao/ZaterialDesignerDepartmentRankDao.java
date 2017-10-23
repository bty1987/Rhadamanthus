package com.fanglin.report.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.report.po.ZaterialDesignerDepartmentRankPO;

public interface ZaterialDesignerDepartmentRankDao extends Dao<ZaterialDesignerDepartmentRankPO> {
	
	public List<ZaterialDesignerDepartmentRankPO> queryZaterialDesignerDepartmentRank();
	
	public ZaterialDesignerDepartmentRankPO queryZaterialDesignerDepartmentRankByDeptIdInit(String deptId,int company);
	
	public List<ZaterialDesignerDepartmentRankPO> queryZaterialDesignerDepartmentRankForTop(int top,int company);

}
