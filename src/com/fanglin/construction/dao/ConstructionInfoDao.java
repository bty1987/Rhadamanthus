package com.fanglin.construction.dao;

import java.util.List;

import com.fanglin.construction.po.ConstructionInfoDO;
import com.fanglin.construction.po.ConstructionInfoPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ConstructionInfoDao extends Dao<ConstructionInfoPO> {

	public List<ConstructionInfoDO> pageConstructionInfo(Paging paging, List<Filter> filters, Integer company) throws FLException;

	public ConstructionInfoPO queryConstructionInfo(long cid);

	public ConstructionInfoPO queryConstructionInfoByOrderId(String orderId);

	public List<?> countConstructionInfo(long startTime, long endTime, int company);

}
