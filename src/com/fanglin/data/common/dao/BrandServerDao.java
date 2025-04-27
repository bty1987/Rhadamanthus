package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.data.po.BrandServerPO;

public interface BrandServerDao extends Dao<BrandServerPO> {

	public List<BrandServerPO> queryBrandServer(long bid);
}
