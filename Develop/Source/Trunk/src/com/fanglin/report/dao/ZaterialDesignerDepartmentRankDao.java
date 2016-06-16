/**
 * @File Name		: ZaterialDesignerDepartmentRankDao.java
 * @Package   	: com.fanglin.dao.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-11-16
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.report.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.report.po.ZaterialDesignerDepartmentRankPO;

public interface ZaterialDesignerDepartmentRankDao extends Dao<ZaterialDesignerDepartmentRankPO> {
	
	public List<ZaterialDesignerDepartmentRankPO> queryZaterialDesignerDepartmentRank();
	
	public ZaterialDesignerDepartmentRankPO queryZaterialDesignerDepartmentRankByDeptIdInit(String deptId);
	
	public List<ZaterialDesignerDepartmentRankPO> queryZaterialDesignerDepartmentRankForTop(int top);

}
