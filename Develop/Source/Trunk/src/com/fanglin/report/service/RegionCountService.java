/**
 * @File Name		: RegionCountService.java
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

import com.fanglin.core.vo.FilterVO;
import com.fanglin.report.vo.RegionCountDetailVO;
import com.fanglin.utils.Paging;

public interface RegionCountService {
	
	public void pageRegionCountDetail(Paging paging, List<FilterVO> filters) throws ParseException;
	
	public List<RegionCountDetailVO> queryRegionCountDetail(List<FilterVO> filters) throws ParseException;
	
	public List<RegionCountDetailVO> queryRegionCountDetailForCurrent(List<FilterVO> filters) throws ParseException;

}
