package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.data.po.BrandInstallPO;

public interface BrandInstallDao extends Dao<BrandInstallPO> {

	public List<BrandInstallPO> queryBrandInstall(long bid);
}
