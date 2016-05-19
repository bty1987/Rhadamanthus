/**
 * @File Name		: DecorationDesignerDepartmentRankDao.java
 * @Package   	: com.fanglin.report.dao
 * @Version		: 1.0
 * @Date			: 2015-6-23
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.report.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.report.po.DecorationDesignerDepartmentRankPO;

public interface DecorationDesignerDepartmentRankDao extends Dao<DecorationDesignerDepartmentRankPO> {
	
	public DecorationDesignerDepartmentRankPO queryDecorationDesignerDepartmentRankForInitByDeptId(String deptId);
	
	public List<DecorationDesignerDepartmentRankPO> queryDecorationDesignerDepartmentRankForTop(int top);

}
