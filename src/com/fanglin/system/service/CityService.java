/**
 * @FileName	: CityService.java
 * @Package   	: com.fanglin.service
 * @Version		: 1.0
 * @Date		: 2014-8-2
 * @Copyright	: Copyright Decoration 2014
 * @Author		: bty1987
 * @Describing	: 
 */
package com.fanglin.system.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.system.vo.CityVO;
import com.fanglin.utils.Paging;

public interface CityService {
	
	public void pageCity(Paging paging, List<Filter> filters);
	
	public List<CityVO> queryCity();
	
	public CityVO queryCityById(CityVO cityVO);
	
	public List<CityVO> queryCityByRegionId(CityVO cityVO);
	
	public List<CityVO> queryCityByName(CityVO cityVO);
	
}
