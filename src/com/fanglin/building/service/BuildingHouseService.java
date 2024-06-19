package com.fanglin.building.service;

import java.util.List;

import com.fanglin.building.vo.BuildingHouseVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface BuildingHouseService {

	public void pageBuildingHouse(Paging paging, List<Filter> filters);

	public void pageBuildingHouseForFollower(Paging paging, List<Filter> filters, String userId);

	public void pageBuildingHouseForAdvance(Paging paging, List<Filter> filters, String userId);

	public BuildingHouseVO queryBuildingHouseByHsid(BuildingHouseVO buildingHouse);

	public BuildingHouseVO queryBuildingHouseByNo(BuildingHouseVO buildingHouse) throws FLException;

	public BuildingHouseVO checkBuildingHouse(BuildingHouseVO buildingHouse) throws FLException;

	public void addBuildingHouse(BuildingHouseVO buildingHouse, String userId, int company) throws FLException;

	public void takeBuildingHouse(BuildingHouseVO buildingHouse, String userId) throws FLException;

	public void updateBuildingHouse(BuildingHouseVO buildingHouse) throws FLException;

	public void updateBuildingHouseForBelong(BuildingHouseVO buildingHouse) throws FLException;

	public void updateBuildingHouseForKeyer(BuildingHouseVO buildingHouse) throws FLException;

	public void updateBuildingHouseForStatus(BuildingHouseVO buildingHouse) throws FLException;

	public void updateBuildingHouseForPath(BuildingHouseVO buildingHouse) throws FLException;

}
