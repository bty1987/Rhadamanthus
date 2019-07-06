package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.MeasurementUnitVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface MeasurementUnitService {

	public List<MeasurementUnitVO> pageMeasurementUnit(Paging paging, List<Filter> filters);

	public List<MeasurementUnitVO> queryMeasurementUnit();

	public void addMeasurementUnit(MeasurementUnitVO measurementUnitVO) throws FLException;

	public void updateMeasurementUnit(MeasurementUnitVO measurementUnitVO) throws FLException;
}
