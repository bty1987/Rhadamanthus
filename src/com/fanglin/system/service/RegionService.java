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

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.vo.RegionVO;
import com.fanglin.utils.Paging;

public interface RegionService {
	
	public void pageRegion(Paging paging, List<Filter> filters);
	
	public List<RegionVO> queryRegion();
	
	public RegionVO queryRegionByRid(RegionVO regionVO);
	
	public List<RegionVO> queryRegionByName(RegionVO regionVO);
	
	public void addRegion(RegionVO regionVO);

	public void updateRegion(RegionVO regionVO) throws FLException;

	public String deleteRegion(List<Integer> rids);

	public void deleteRegionByRid(Integer rid);

	/**
	 * 省份存在验证方法 - 通过名称进行验证
	 * 不存在则创建,存在则返回省份信息
	 * @param name 省份名称
	 * @return 省份信息VO
	 */
	public RegionVO existRegion(String name);

}
