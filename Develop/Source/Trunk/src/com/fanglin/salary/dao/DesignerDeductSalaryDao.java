/**
 * @File Name		: DesignerDeductSalaryDao.java
 * @Package   	: com.fanglin.dao.salary
 * @Version		: 1.0
 * @Date			: 2014-11-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.salary.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.salary.po.DesignerDeductSalaryPO;
import com.fanglin.utils.Paging;

public interface DesignerDeductSalaryDao extends Dao<DesignerDeductSalaryPO>{
	
	public List<DesignerDeductSalaryPO> pageDesignerDeductSalary(Paging paging, List<Filter> filters);
	
	public List<DesignerDeductSalaryPO> queryDesignerDeductSalary(List<Filter> filters);
	
	public List<DesignerDeductSalaryPO> queryDesignerDeductSalaryByDsId(int dsId);

}
