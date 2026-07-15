package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.HolidayDao;
import com.fanglin.data.common.service.HolidayService;
import com.fanglin.data.common.vo.HolidayVO;
import com.fanglin.data.po.HolidayPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("holidayService")
@Transactional(readOnly = true)
public class HolidayServiceImpl implements HolidayService {

	@Autowired
	private HolidayDao holidayDao;

	@Override
	public void pageHoliday(Paging paging, List<Filter> filters) {

		List<HolidayPO> holidayPOs = holidayDao.pageHoliday(paging, filters);
		List<HolidayVO> holidayVOs = new ArrayList<HolidayVO>();

		for (HolidayPO holidayPO : holidayPOs) {

			HolidayVO holidayVO = new HolidayVO();

			BeanUtil.copyProperties(holidayPO, holidayVO);

			holidayVOs.add(holidayVO);
		}

		paging.setData(holidayVOs);

	}

	@Override
	public List<HolidayVO> queryHoliday(HolidayVO holiday) {

		List<HolidayPO> holidayPOs = holidayDao.queryHoliday(holiday.getPeriod(), holiday.getStartTime(), holiday.getEndTime(), holiday.getAtttype());
		List<HolidayVO> holidayVOs = new ArrayList<HolidayVO>();

		for (HolidayPO holidayPO : holidayPOs) {

			HolidayVO holidayVO = new HolidayVO();

			BeanUtil.copyProperties(holidayPO, holidayVO);

			holidayVOs.add(holidayVO);
		}

		return holidayVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addHoliday(HolidayVO holiday) throws FLException {

		List<HolidayPO> holidayPOs = holidayDao.queryHoliday(holiday.getPeriod(), holiday.getStartTime(), holiday.getEndTime(), holiday.getAtttype());

		if (holidayPOs.size() > 0) {
			throw new FLException(130159, "假期已存在");
		}

		HolidayPO holidayPO = new HolidayPO();

		BeanUtil.copyProperties(holiday, holidayPO);

		long start = holiday.getStartTime().getTime();
		long end = holiday.getEndTime().getTime();

		Calendar cal = Calendar.getInstance();
		cal.setTimeInMillis(start);
		String period = String.valueOf(cal.get(Calendar.YEAR));

		long diff = Math.abs(Arith.sub(end, start));
		int daynum = (int) Arith.add(diff / (24 * 60 * 60 * 1000), 1);

		holidayPO.setPeriod(period);
		holidayPO.setDaynum(daynum);

		holidayDao.save(holidayPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateHoliday(HolidayVO holiday) throws FLException {

		HolidayPO holidayPO = holidayDao.get(holiday.getHdid());

		if (holidayPO == null) {
			throw new FLException(130160, "假期不存在");
		}

		BeanUtil.copyProperties(holiday, holidayPO);

		long start = holiday.getStartTime().getTime();
		long end = holiday.getEndTime().getTime();

		Calendar cal = Calendar.getInstance();
		cal.setTimeInMillis(start);
		String period = String.valueOf(cal.get(Calendar.YEAR));

		long diff = Math.abs(Arith.sub(end, start));
		int daynum = (int) Arith.add(diff / (24 * 60 * 60 * 1000), 1);

		holidayPO.setPeriod(period);
		holidayPO.setDaynum(daynum);

		holidayDao.update(holidayPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteHoliday(HolidayVO holiday) throws FLException {

		HolidayPO holidayPO = holidayDao.get(holiday.getHdid());

		if (holidayPO == null) {
			throw new FLException(130160, "假期不存在");
		}

		holidayDao.delete(holidayPO);
	}
}
