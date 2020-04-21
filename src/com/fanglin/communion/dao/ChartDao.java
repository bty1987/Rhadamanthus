package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.ChartPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ChartDao extends Dao<ChartPO> {

	public List<ChartPO> pageChart(Paging paging, List<Filter> filters);
	
}
