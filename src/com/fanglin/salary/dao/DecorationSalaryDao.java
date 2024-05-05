package com.fanglin.salary.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.salary.po.DecorationSalaryPO;
import com.fanglin.utils.Paging;

public interface DecorationSalaryDao extends Dao<DecorationSalaryPO> {

	public List<DecorationSalaryPO> pageDecorationSalary(Paging paging, List<Filter> filter) throws FLException;

}
