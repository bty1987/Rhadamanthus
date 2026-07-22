package com.fanglin.construction.dao;

import java.util.List;

import com.fanglin.construction.po.ConstructionScheduleDO;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ConstructionScheduleDao extends Dao<ConstructionSchedulePO> {

	public List<ConstructionScheduleDO> pageConstructionSchedule(Paging paging, List<Filter> filters, Integer company) throws FLException;

	public List<ConstructionSchedulePO> queryConstructionScheduleByOrderId(String orderId);
	public List<ConstructionSchedulePO> queryConstructionScheduleForAccountByOrderId(String orderId);

	public List<ConstructionSchedulePO> queryConstructionScheduleByCid(long cid);

	public ConstructionSchedulePO queryConstructionScheduleByOrderId(String orderId, short schedule);

	public ConstructionSchedulePO queryConstructionScheduleByOrderId(String orderId, long cnid);

	public ConstructionSchedulePO queryConstructionScheduleByCid(long cid, short schedule);

	public ConstructionSchedulePO queryConstructionScheduleByCid(long cid, long cnid);

	public int countConstructionSchedule(long cid, short status, short process);

}
