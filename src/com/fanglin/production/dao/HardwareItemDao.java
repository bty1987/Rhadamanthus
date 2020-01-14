package com.fanglin.production.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.po.HardwareItemPO;
import com.fanglin.utils.Paging;

public interface HardwareItemDao extends Dao<HardwareItemPO> {

	public List<HardwareItemPO> pageHardwareItemByHid(Paging paging, List<Filter> filters, long hid);
	
	public int deleteHardwareItemByHid(long hid);
}
