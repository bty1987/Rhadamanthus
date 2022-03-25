package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.construction.po.ConstructionDrawingPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ConstructionDrawingDao extends Dao<ConstructionDrawingPO> {

	public List<ConstructionDrawingPO> queryCusConstructionDrawing(Paging paging, List<Filter> filters, long cid, short schedule);

}
