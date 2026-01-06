package com.fanglin.system.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.po.CityProperPO;
import com.fanglin.utils.Paging;

public interface CityProperDao extends Dao<CityProperPO> {

	public List<CityProperPO> pageCityProper(Paging paging, List<Filter> filters);

	public List<CityProperPO> pageCityProper(Paging paging, String name);

	public List<CityProperPO> queryCityProper(Integer cid);

	public List<CityProperPO> queryCityProper(List<Integer> cids);

	public CityProperPO queryCityProper(String name);

	public int countCityProper(Integer cid);

}
