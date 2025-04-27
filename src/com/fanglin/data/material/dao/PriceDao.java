package com.fanglin.data.material.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.PriceGO;
import com.fanglin.data.po.PricePO;
import com.fanglin.utils.Paging;

public interface PriceDao extends Dao<PricePO> {

	public List<PriceGO> pagePrice(Paging paging, List<Filter> filters, int company);

	public List<PricePO> queryPriceByGid(long gid, Short status);

	public PricePO queryPriceByPid(long pid);

	public int batchSavePrice(long gid, long gpid);
}
