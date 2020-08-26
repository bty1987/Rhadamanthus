package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.data.po.BrandBalancePO;

public interface BrandBalanceDao extends Dao<BrandBalancePO> {

	public List<BrandBalancePO> queryBrandBalance(long bid);
	
}
