package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.HousePO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface HouseDao extends Dao<HousePO> {

	public List<HousePO> pageHouse(Paging paging, List<Filter> filters, Integer company);

	public HousePO queryHouseByNoAHnum(String no, String houseNumber, Integer company);
}
