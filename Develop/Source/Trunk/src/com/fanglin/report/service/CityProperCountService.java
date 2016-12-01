/**
 * @File Name		: CityProperCountService.java
 * @Package   	: com.fanglin.report.service
 * @Version		: 1.0
 * @Date			: 2016-11-1
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.report.service;

import java.text.ParseException;
import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.report.vo.CityProperCountDetailVO;
import com.fanglin.utils.Paging;

public interface CityProperCountService {
	
	public void pageCityProperCountDetail(Paging paging, List<Filter> filters) throws ParseException;
	
	public List<CityProperCountDetailVO> queryCityProperCountDetail(List<Filter> filters) throws ParseException;
	
	public List<CityProperCountDetailVO> queryCityProperCountDetailByCurrent(List<Filter> filters) throws ParseException;

}
