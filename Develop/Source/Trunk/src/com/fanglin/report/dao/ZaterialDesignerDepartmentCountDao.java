/**
 * @File Name		: ZaterialDesignerDepartmentCountDao.java
 * @Package   	: com.fanglin.dao.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-11-15
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.report.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.report.po.ZaterialDesignerDepartmentCountPO;

public interface ZaterialDesignerDepartmentCountDao extends Dao<ZaterialDesignerDepartmentCountPO> {
	
	public ZaterialDesignerDepartmentCountPO queryZaterialDesignerDepartmentCountByDeptIdTime(String deptId, String time);
	
	public List<ZaterialDesignerDepartmentCountPO> queryZaterialDesignerDepartmentCount(List<FilterVO> filters);
	
	public List<Object> countZaterialDesignerDepartmentCount(List<FilterVO> filters);

}
