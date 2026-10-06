package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.utils.Paging;

public interface ConstructionNodeDao extends Dao<ConstructionNodePO> {

	public List<ConstructionNodePO> pageConstructionNode(Paging paging, List<Filter> filters, int company);

	public List<ConstructionNodePO> queryConstructionNode(int company);

	public List<ConstructionNodePO> queryConstructionNodeForGroup(String name, int limit);

	public ConstructionNodePO queryConstructionNodeBySort(short sort, int company);

	public int countConstructionNode(short process, int company);

	public int countConstructionNodeForMark(short mark, int company);

}
