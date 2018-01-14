package com.fanglin.building.service;

import java.util.List;

import com.fanglin.building.vo.HouseSourceVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface HouseSourceService {

	public void pageHouseSource(Paging paging, List<Filter> filters);

	public HouseSourceVO queryHouseSourceByHsid(HouseSourceVO houseSource);
	
	public HouseSourceVO queryHouseSourceForNo(HouseSourceVO houseSource) throws FLException;
	
	public HouseSourceVO checkHouseSourceByHidAndType(HouseSourceVO houseSource) throws FLException;

	public void addHouseSource(HouseSourceVO houseSource, String userId) throws FLException;

	public void updateHouseSource(HouseSourceVO houseSource) throws FLException;

	public void updateHouseSourceForBelong(HouseSourceVO houseSource) throws FLException;

	public void updateHouseSourceForStatus(HouseSourceVO houseSource) throws FLException;

}
