package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.FlowpathPO;
import com.fanglin.utils.Paging;

public interface FlowpathDao extends Dao<FlowpathPO> {

	public List<FlowpathPO> pageFlowpath(Paging paging, List<Filter> filters);

	public List<FlowpathPO> queryFlowpath(long fpid, String keyword);

}
