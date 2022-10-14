package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.data.po.FlowitemPO;

public interface FlowitemDao extends Dao<FlowitemPO> {

	public List<FlowitemPO> queryFlowitem(long fpid);

	public int deleteFlowitem(long fpid);

}
