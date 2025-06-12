package com.fanglin.sales.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.sales.vo.SalesActivityRecordVO;

public interface SalesActivityRecordService {

	public List<SalesActivityRecordVO> querySalesActivityRecord(SalesActivityRecordVO salesActivityRecordVO) throws FLException;

	public int addSalesActivityRecord(SalesActivityRecordVO salesActivityRecordVO, String userId) throws FLException;
}
