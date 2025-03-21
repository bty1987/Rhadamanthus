package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.InspectItemPO;
import com.fanglin.utils.Paging;

public interface InspectItemDao extends Dao<InspectItemPO> {

	public List<InspectItemPO> pageInspectItem(Paging paging, List<Filter> filters);

	public List<InspectItemPO> queryInspectItem(Long iid);

}
