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

import com.fanglin.core.vo.FilterVO;
import com.fanglin.system.vo.RegionVO;
import com.fanglin.utils.Paging;

public interface RegionService {
	
	public void pageRegion(Paging paging, List<FilterVO> filters);
	
	public List<RegionVO> queryRegion();

	public void addRegion(RegionVO regionVO);

	public void updateRegion(RegionVO regionVO);

	public RegionVO queryRegionById(RegionVO regionVO);

	public String deleteRegion(List<String> regionIds);

	public void deleteRegionById(String regionId);
}
