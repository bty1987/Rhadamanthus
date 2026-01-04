package com.fanglin.system.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.po.CityProperPO;
import com.fanglin.utils.Paging;


public interface CityProperDao extends Dao<CityProperPO> {
	
	public List<CityProperPO> pageCityProper(Paging paging, List<Filter> filters);
	
	public List<CityProperPO> pageCityProperByName(Paging paging, String name);
	
	public List<CityProperPO> queryCityProperByCid(Integer cid);
	
	public List<CityProperPO> queryCityProperByCids(List<Integer> cids);

	public int countCityProperByCid(Integer cid);

	public CityProperPO queryCityProperByNameAndCid(String name, Integer cid);
}
