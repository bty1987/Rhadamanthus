package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.InspectPO;
import com.fanglin.utils.Paging;

public interface InspectDao extends Dao<InspectPO> {

	public List<InspectPO> pageInspect(Paging paging, List<Filter> filters);

	public List<InspectPO> queryInspect(Short atttype, Short type);

}
