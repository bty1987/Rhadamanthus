package com.fanglin.salary.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.salary.po.DesignerSalaryPO;
import com.fanglin.utils.Paging;

public interface DesignerSalaryDao extends Dao<DesignerSalaryPO> {

	public List<DesignerSalaryPO> pageDesignerSalary(Paging paging, List<Filter> filter);

	public DesignerSalaryPO queryDesignerSalaryByDuid(long duid);

	public void deleteDesignerSalary(long dsid);
}
