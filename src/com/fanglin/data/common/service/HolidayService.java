package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.HolidayVO;
import com.fanglin.utils.Paging;

public interface HolidayService {

	public void pageHoliday(Paging paging, List<Filter> filters);

	public List<HolidayVO> queryHoliday(HolidayVO holiday);

	public void addHoliday(HolidayVO holiday) throws FLException;

	public void updateHoliday(HolidayVO holiday) throws FLException;

	public void deleteHoliday(HolidayVO holiday) throws FLException;

}
