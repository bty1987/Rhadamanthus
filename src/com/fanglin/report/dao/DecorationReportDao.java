package com.fanglin.report.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.po.DecorationReportPO;
import com.fanglin.utils.Paging;

public interface DecorationReportDao extends Dao<DecorationReportPO>{

	public List<DecorationReportPO> queryDecoration7Construction(Paging paging, List<Filter> list);
	
	public List<?> queryDecorationConstruction();
	
	public List<?> queryDecorationConstructionAllCdidADcid();
}
