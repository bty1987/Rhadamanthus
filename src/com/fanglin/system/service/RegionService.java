/**
 * @FileName	: RegionService.java
 * @Package   	: com.fanglin.service
 * @Version		: 1.0
 * @Date		: 2014-7-28
 * @Copyright	: Copyright Decoration 2014
 * @Author		: bty1987
 * @Describing	: 
 */
package com.fanglin.system.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.system.vo.RegionVO;
import com.fanglin.utils.Paging;

public interface RegionService {
	
	public void pageRegion(Paging paging, List<Filter> filters);
	
	public List<RegionVO> queryRegion();
	
	public RegionVO queryRegionById(RegionVO regionVO);
	
	public List<RegionVO> queryRegionByName(RegionVO regionVO);

}
