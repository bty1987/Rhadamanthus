package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.MaterialPlanNodePO;
import com.fanglin.utils.Paging;

public interface MaterialPlanNodeDao extends Dao<MaterialPlanNodePO> {

	public List<MaterialPlanNodePO> pageMaterialPlanNode(Paging paging, List<Filter> filters, int company);

	public List<MaterialPlanNodePO> queryMaterialPlanNode(int company);

	public int countMaterialPlanNode(int company, short type, long cid, long bid, long cnid, short action);

}
