/**
 * @File Name		: MeasurementUnitService.java
 * @Package   	: com.fanglin.service
 * @Version		: 1.0
 * @Date			: 2014-7-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.MeasurementUnitVO;
import com.fanglin.utils.Paging;

public interface MeasurementUnitService {
	
	public List<MeasurementUnitVO> pageMeasurementUnit(Paging paging, List<Filter> filters);
	
	public List<MeasurementUnitVO> queryMeasurementUnit();

}
