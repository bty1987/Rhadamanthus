package com.fanglin.data.material.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.data.po.PricePO;

public interface PriceDao extends Dao<PricePO> {

	public List<PricePO> queryPriceByGid(long gid);

	public PricePO queryPriceByPid(long pid);
}
