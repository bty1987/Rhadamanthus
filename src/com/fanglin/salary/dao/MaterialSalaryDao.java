package com.fanglin.salary.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.salary.po.MaterialSalaryPO;
import com.fanglin.utils.Paging;

public interface MaterialSalaryDao extends Dao<MaterialSalaryPO> {

	public List<MaterialSalaryPO> pageMaterialSalary(Paging paging, List<Filter> filters) throws FLException;

}
