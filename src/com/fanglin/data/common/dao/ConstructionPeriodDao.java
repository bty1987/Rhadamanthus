package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.ConstructionPeriodPO;
import com.fanglin.utils.Paging;

public interface ConstructionPeriodDao extends Dao<ConstructionPeriodPO> {

	public List<ConstructionPeriodPO> pageConstructionPeriod(Paging paging, List<Filter> filters, int company);

	public ConstructionPeriodPO queryConstructionPeriod(int area, int company);

}
