package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.MeasurementUnitPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface MeasurementUnitDao extends Dao<MeasurementUnitPO> {

	public List<MeasurementUnitPO> pageMeasurementUnit(Paging paging, List<Filter> filters);

	public MeasurementUnitPO queryMeasurementUnitByName(String name);

	public MeasurementUnitPO queryMeasurementUnitById(int id);

}
