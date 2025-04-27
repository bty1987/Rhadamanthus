package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.data.po.BrandDeliverPO;

public interface BrandDeliverDao extends Dao<BrandDeliverPO> {

	public List<BrandDeliverPO> queryBrandDeliver(long bid);
}
