package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.CppointVO;
import com.fanglin.utils.Paging;

public interface CppointRecordService {

	public void queryCppointRecord(CppointVO cppointVO, Paging paging, List<Filter> filters);

}
