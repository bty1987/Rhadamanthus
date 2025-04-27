package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.data.po.BrandProductPO;

public interface BrandProductDao extends Dao<BrandProductPO> {

	public List<BrandProductPO> queryBrandProduct(long bid);
}
