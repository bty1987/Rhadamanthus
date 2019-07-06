package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.ServiceNodePO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ServiceNodeDao extends Dao<ServiceNodePO> {

	public List<ServiceNodePO> pageServiceNode(Paging paging, List<Filter> filters, int company);

	public List<ServiceNodePO> queryServiceNodeByType(short type);

}
