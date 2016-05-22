/**
 * @File Name		: CityProperService.java
 * @Package   	: com.fanglin.service
 * @Version		: 1.0
 * @Date			: 2014-8-8
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.system.service;

import java.util.List;

import com.fanglin.core.vo.FilterVO;
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.utils.Paging;

public interface CityProperService {
	
	public void pageCityProper(Paging paging, List<FilterVO> filters);
	
	public List<CityProperVO> queryCityProper();
	
	public CityProperVO queryCityProperById(CityProperVO cityProperVO);
	
	public List<CityProperVO> queryCityProperByCityId(CityProperVO cityProperVO);
	
	public void saveOrUpdateCityProper(CityProperVO cityProperVO);
	
	public void deleteCityProperById(String id);
	
	public String deleteCityProper(List<String> ids);
	
}
