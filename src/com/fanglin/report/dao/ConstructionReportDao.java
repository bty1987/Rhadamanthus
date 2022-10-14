package com.fanglin.report.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.po.ConstructionReportPO;
import com.fanglin.utils.Paging;

public interface ConstructionReportDao extends Dao<ConstructionReportPO> {

	public List<ConstructionReportPO> queryConstruction7Achievement(Paging paging, List<Filter> filters, int company);

}
