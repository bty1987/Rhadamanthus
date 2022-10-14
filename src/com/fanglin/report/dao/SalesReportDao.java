package com.fanglin.report.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.po.SalesAchievementsPO;
import com.fanglin.utils.Paging;

public interface SalesReportDao extends Dao<SalesAchievementsPO> {

	public List<SalesAchievementsPO> querySales7Achievement(Paging paging, List<Filter> filters, int company);

}
