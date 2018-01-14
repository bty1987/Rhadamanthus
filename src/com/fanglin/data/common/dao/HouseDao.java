package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.HousePO;
import com.fanglin.utils.Paging;

public interface HouseDao extends Dao<HousePO> {
	
	public List<HousePO> pageHouse(Paging paging, List<Filter> filters);
	
	public HousePO queryHouseByNoAHnum(String no,String houseNumber,Short status);
}
