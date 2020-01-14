package com.fanglin.production.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.po.HardwarePO;
import com.fanglin.utils.Paging;

public interface HardwareDao extends Dao<HardwarePO> {

	public List<HardwarePO> pageHardware(Paging paging, List<Filter> filters, int company);
	
	public List<HardwarePO> queryHardwareByPid(long pid);

	public int countHardware(Long pid, Short status);;
}
