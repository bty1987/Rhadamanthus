/**
 * @File Name		: VillageCountService.java
 * @Package   	: com.fanglin.report.service
 * @Version		: 1.0
 * @Date			: 2016-11-1
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.report.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.VillageVO;
import com.fanglin.report.vo.VillageCountDetailVO;
import com.fanglin.report.vo.VillageCountVO;
import com.fanglin.utils.Paging;

public interface VillageCountService {
	
	public void pageVillageCountDetail(Paging paging, List<Filter> filters);
	
	public List<VillageCountVO> queryVillageCountByXY(VillageVO villageVO, double range);
	
	public List<VillageCountDetailVO> queryVillageCountDetails(List<Filter> filters);

}
