package com.fanglin.construction.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.construction.po.ConstructionProfilePO;
import com.fanglin.utils.Paging;

public interface ConstructionProfileDao extends Dao<ConstructionProfilePO> {

	public List<ConstructionProfilePO> pageConstructionProfile(Paging paging, List<Filter> filters, int company);

	public List<ConstructionProfilePO> queryConstructionProfileByCid(long cid, Short type);

	public List<ConstructionProfilePO> queryConstructionProfileByOrderId(String orderId, Short type);

}
