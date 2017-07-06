/**
 * @File Name		: MeasurementUnitDao.java
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-7-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.MeasurementUnitPO;
import com.fanglin.utils.Paging;

public interface MeasurementUnitDao extends Dao<MeasurementUnitPO> {
	
	public List<MeasurementUnitPO> pageMeasurementUnit(Paging paging,List<Filter> filters);

	public MeasurementUnitPO queryMeasurementUnitByName(String name);

	public MeasurementUnitPO queryMeasurementUnitById(int id);
	
}
