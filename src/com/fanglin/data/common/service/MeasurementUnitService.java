package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.MeasurementUnitVO;
import com.fanglin.utils.Paging;

public interface MeasurementUnitService {
	
	public List<MeasurementUnitVO> pageMeasurementUnit(Paging paging, List<Filter> filters);
	
	public List<MeasurementUnitVO> queryMeasurementUnit();

}
