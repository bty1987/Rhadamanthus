package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.HouseLayoutPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface HouseLayoutDao extends Dao<HouseLayoutPO> {

	public List<HouseLayoutPO> pageHouseLayout(Paging paging, List<Filter> filters);

	public List<HouseLayoutPO> queryHouseLayout(long vid);

}
