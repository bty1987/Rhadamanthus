package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.PricePoolPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface PricePoolDao extends Dao<PricePoolPO> {

	public List<PricePoolPO> pagePricePool(Paging paging, List<Filter> filters);

	public List<PricePoolPO> queryPricePoolByGpid(long gpid, Short status);

	public PricePoolPO queryPricePoolByPpid(long ppid);
}
