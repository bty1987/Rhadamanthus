/**
 * @File Name		: MaterialDepartmentCountDao.java
 * @Package   	: com.fanglin.dao.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-11-14
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.report.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.report.po.MaterialDepartmentCountPO;

public interface MaterialDepartmentCountDao extends Dao<MaterialDepartmentCountPO> {
	
	public MaterialDepartmentCountPO queryMaterialDepartmentCountByDeptIdTime(String deptId, String time);
	
	public List<MaterialDepartmentCountPO> queryMaterialDepartmentCount(List<FilterVO> filters);
	
}
