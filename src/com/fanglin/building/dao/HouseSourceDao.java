package com.fanglin.building.dao;

import java.util.List;

import com.fanglin.building.po.HouseSourcePO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface HouseSourceDao extends Dao<HouseSourcePO> {

	public List<HouseSourcePO> pageHouseSource(Paging paging, List<Filter> filters, List<Integer> dids);
	
	public HouseSourcePO queryHouseSourceByNo(String no);

	public HouseSourcePO checkHouseSource(Long hid, Short type);
	
	public int countHouseSource(Long hid, Short type);

}
