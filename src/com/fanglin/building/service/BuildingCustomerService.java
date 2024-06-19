package com.fanglin.building.service;

import java.util.List;

import com.fanglin.building.vo.BuildingCustomerVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface BuildingCustomerService {

	public void pageBuildingCustomer(Paging paging, List<Filter> filters, String userId);

	public BuildingCustomerVO queryBuildingCustomerByCsid(BuildingCustomerVO buildingCustomer);

	public BuildingCustomerVO queryBuildingCustomerByNo(BuildingCustomerVO buildingCustomer) throws FLException;

	public BuildingCustomerVO checkBuildingCustomer(BuildingCustomerVO buildingCustomer) throws FLException;

	public void addBuildingCustomer(BuildingCustomerVO buildingCustomer, String userId, int company) throws FLException;

	public void updateBuildingCustomer(BuildingCustomerVO buildingCustomer) throws FLException;

	public void updateBuildingCustomerForStatus(BuildingCustomerVO buildingCustomer) throws FLException;

}
