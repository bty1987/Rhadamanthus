package com.fanglin.building.dao;

import java.util.List;

import com.fanglin.building.po.BuildingHousePO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface BuildingHouseDao extends Dao<BuildingHousePO> {

	public List<BuildingHousePO> pageBuildingHouse(Paging paging, List<Filter> filters, List<Integer> dids);

	public BuildingHousePO queryBuildingHouseByNo(String no);

	public BuildingHousePO checkBuildingHouse(Long hid, Short type);

	public int countBuildingHouse(Long hid, Short type);

}
