package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.ConstructionNodeCompanyPO;
import com.fanglin.communion.po.ConstructionNodePO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ConstructionNodeDao extends Dao<ConstructionNodePO> {

	public List<ConstructionNodePO> pageConstructionNode(Paging paging, List<Filter> filters);

	public List<ConstructionNodePO> queryConstructionNode(Short status);

	public List<ConstructionNodeCompanyPO> queryConstructionNodeCompanyByCid(Integer cid);
	
}
