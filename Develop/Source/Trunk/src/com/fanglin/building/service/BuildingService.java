package com.fanglin.building.service;

import java.util.List;

import com.fanglin.building.vo.BuildingVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface BuildingService {

	public void pageBuilding(Paging paging, List<Filter> filters);

	public BuildingVO queryBuildingByBoid(BuildingVO building);
	
	public BuildingVO queryBuilding(BuildingVO building) throws FLException;

	public void bindBuilding(BuildingVO building, String userId) throws FLException;

	public void unbindBuilding(BuildingVO building) throws FLException;

	public void updateBuildingForBalanceStatus(BuildingVO building) throws FLException;

	public void updateBuildingForPayType(BuildingVO building, String userId) throws FLException;

}
