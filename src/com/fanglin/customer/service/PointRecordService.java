package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.PointAccountVO;
import com.fanglin.utils.Paging;

public interface PointRecordService {

	public void queryPointRecord(PointAccountVO pointAccountVO, Paging paging, List<Filter> filters);

}
