package com.fanglin.building.dao;

import java.util.List;

import com.fanglin.building.po.BuildingCustomerPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface BuildingCustomerDao extends Dao<BuildingCustomerPO> {

	public List<BuildingCustomerPO> pageBuildingCustomer(Paging paging, List<Filter> filters, Integer uid);

	public BuildingCustomerPO queryBuildingCustomerByNo(String no);

	public BuildingCustomerPO checkBuildingCustomer(Long cid, Short type);

	public int countBuildingCustomer(Long id, Short type);

}
