package com.fanglin.report.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.report.po.DecorationDesignerDepartmentRankPO;

public interface DecorationDesignerDepartmentRankDao extends Dao<DecorationDesignerDepartmentRankPO> {
	
	public DecorationDesignerDepartmentRankPO queryDecorationDesignerDepartmentRankForInitByDeptId(String deptId,int company);
	
	public List<DecorationDesignerDepartmentRankPO> queryDecorationDesignerDepartmentRankForTop(int top,int company);

}
