/**
 * @File Name		: DecorationDepartmentRankDao.java
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
import com.fanglin.report.po.DecorationDepartmentRankPO;

public interface DecorationDepartmentRankDao extends Dao<DecorationDepartmentRankPO> {

	public DecorationDepartmentRankPO queryDecorationDepartmentRankForInitByDeptId(String deptId, int company);

	public List<DecorationDepartmentRankPO> queryDecorationDepartmentRankForTop(int top, int month, Integer ddid, Integer drid, Short type, int company);

}
