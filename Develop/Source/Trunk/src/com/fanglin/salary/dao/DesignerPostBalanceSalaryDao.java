/**
 * @File Name		: DesignerPostBalanceSalaryDao.java
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
import com.fanglin.core.vo.Filter;
import com.fanglin.salary.po.DesignerPostBalanceSalaryPO;
import com.fanglin.utils.Paging;

public interface DesignerPostBalanceSalaryDao extends Dao<DesignerPostBalanceSalaryPO> {
	
	public List<DesignerPostBalanceSalaryPO> pageDesignerPostBalanceSalary(Paging paging, List<Filter> filters);
	
	public List<DesignerPostBalanceSalaryPO> pageDesignerPostBalanceSalaryByMsoId(Paging paging, List<Filter> filters, long msoId);
	
	public List<DesignerPostBalanceSalaryPO> queryDesignerPostBalanceSalaryByDsId(int dsId);

}
