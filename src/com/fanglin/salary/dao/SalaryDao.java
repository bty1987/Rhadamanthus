package com.fanglin.salary.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.salary.po.SalaryPO;
import com.fanglin.utils.Paging;

public interface SalaryDao extends Dao<SalaryPO> {
	
	public List<SalaryPO> pageSalaryPO(Paging paging, List<Filter> filters);

}
