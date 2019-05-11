package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.ConstructionNodePO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ConstructionNodeDao extends Dao<ConstructionNodePO> {

	public List<ConstructionNodePO> pageConstructionNode(Paging paging, List<Filter> filters, int company);

	public List<ConstructionNodePO> queryConstructionNode(int company);
	
	public ConstructionNodePO queryConstructionNodeBySort(short sort, int company);

}
