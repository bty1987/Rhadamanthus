/**
 * @File Name		: DesignerPreBalanceSalaryDao.java
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
import com.fanglin.salary.po.DesignerPreBalanceSalaryPO;
import com.fanglin.utils.Paging;

public interface DesignerPreBalanceSalaryDao extends Dao<DesignerPreBalanceSalaryPO> {
	
	public List<DesignerPreBalanceSalaryPO> pageDesignerPreBalanceSalary(Paging paging, List<FilterVO> filters);
	
	public List<DesignerPreBalanceSalaryPO> pageDesignerPreBalanceSalaryByMsoId(Paging paging, List<FilterVO> filters, long msoId);
	
	public List<DesignerPreBalanceSalaryPO> queryDesignerPreBalanceSalaryByDsId(int dsId);
	
}
