package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.DutyVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface DutyService {
	public void pageDuty(Paging paging, List<Filter> filters);

	public List<DutyVO> queryDuty();

	public List<DutyVO> queryDutyByDtid(DutyVO duty);

	public int addDuty(DutyVO dutyVO) throws FLException;

	public int updateDuty(DutyVO dutyVO) throws FLException;

	public int updateDutyForStatus(DutyVO dutyVO) throws FLException;
}
