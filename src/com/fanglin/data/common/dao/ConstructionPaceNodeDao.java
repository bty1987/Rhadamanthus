package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.ConstructionPaceNodePO;
import com.fanglin.utils.Paging;

public interface ConstructionPaceNodeDao extends Dao<ConstructionPaceNodePO> {

	public List<ConstructionPaceNodePO> pageConstructionPaceNode(Paging paging, List<Filter> filters, int company, Long cpid);

	public List<ConstructionPaceNodePO> queryConstructionPaceNode(long cpid);

}
