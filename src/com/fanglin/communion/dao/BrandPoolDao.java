package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.BrandPoolPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface BrandPoolDao extends Dao<BrandPoolPO>{

	public List<BrandPoolPO> pageBrandPool(Paging paging, List<Filter> filters);

	public List<BrandPoolPO> queryBrandPoolByName(String name);
}
