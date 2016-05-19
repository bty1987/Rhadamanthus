/**
 * @File Name		: DesignerSalaryDao.java
 * @Package   	: com.fanglin.dao.salary
 * @Version		: 1.0
 * @Date			: 2014-10-31
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.salary.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.salary.po.DesignerSalaryPO;
import com.fanglin.utils.Paging;

public interface DesignerSalaryDao extends Dao<DesignerSalaryPO> {
	
	public List<DesignerSalaryPO> pageDesignerSalary(Paging paging, List<FilterVO> filters, Integer status);
	
	public DesignerSalaryPO queryDesignerSalaryByUserIdInit(String userId);
	
	public List<DesignerSalaryPO> queryDesignerSalaryByUserId(String userId);
	
	public List<DesignerSalaryPO> queryDesignerSalaryByInit();
	
	public DesignerSalaryPO queryDesignerSalaryByDsId(int dsId);
	
}
