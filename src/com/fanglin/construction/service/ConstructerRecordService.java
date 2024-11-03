package com.fanglin.construction.service;

import java.util.List;

import com.fanglin.construction.vo.ConstructerRecordVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ConstructerRecordService {

	public void pageConstructerRecord(Paging paging, List<Filter> filters, Integer company) throws FLException;

	public List<ConstructerRecordVO> queryConstructerRecord(ConstructerRecordVO constructerRecordVO);

	public void addConstructerRecord(ConstructerRecordVO constructerRecordVO) throws FLException;
}
