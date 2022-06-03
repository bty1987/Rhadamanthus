/**
 * @FileName	: CityService.java
 * @Package   	: com.fanglin.service
 * @Version		: 1.0
 * @Date		: 2014-8-2
 * @Copyright	: Copyright Decoration 2014
 * @Author		: Howard
 * @Describing	: 
 */

package com.fanglin.system.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.vo.CityVO;
import com.fanglin.utils.Paging;

public interface CityService {

	public void pageCity(Paging paging, List<Filter> filters);

	public List<CityVO> queryCity();

	public CityVO queryCityByCid(CityVO cityVO) throws FLException;

	public List<CityVO> queryCityByRid(CityVO cityVO);

	public List<CityVO> queryCityByName(CityVO cityVO);

	public void addCity(CityVO cityVO);

	public void updateCity(CityVO cityVO) throws FLException;

	public int updateCityForPosition(CityVO cityVO) throws FLException;

	public int deleteCity(List<Integer> cids) throws FLException;

}
