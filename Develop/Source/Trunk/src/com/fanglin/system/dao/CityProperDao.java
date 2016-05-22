package com.fanglin.system.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.system.po.CityProperPO;
import com.fanglin.utils.Paging;


public interface CityProperDao extends Dao<CityProperPO> {
	
	public List<CityProperPO> pageCityProper(Paging paging, List<FilterVO> filters);
	
	public List<CityProperPO> queryCityProperByCityId(String cityId);
	
	public List<CityProperPO> queryCityProperByCityIds(List<String> cityIds);
}
