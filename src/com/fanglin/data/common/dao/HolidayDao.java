package com.fanglin.data.common.dao;

import java.sql.Timestamp;
import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.HolidayPO;
import com.fanglin.utils.Paging;

public interface HolidayDao extends Dao<HolidayPO> {

	public List<HolidayPO> pageHoliday(Paging paging, List<Filter> filters);

	public List<HolidayPO> queryHoliday(String period, Timestamp starTime, Timestamp endTime, Short atttype);

}
