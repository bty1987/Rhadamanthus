package com.fanglin.data.construction.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.ConstructionNodeCompanyPO;
import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.utils.Paging;

public interface ConstructionNodeDao extends Dao<ConstructionNodePO> {

	public List<ConstructionNodePO> pageConstructionNode(Paging paging, List<Filter> filters);

	public List<ConstructionNodePO> queryConstructionNode(Short status);

	public List<ConstructionNodeCompanyPO> queryConstructionNodeCompanyByCid(Integer cid);
	
}
