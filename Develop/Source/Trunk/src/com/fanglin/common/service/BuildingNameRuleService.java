/**
 * @File Name		: BuildingNameRuleService.java
 * @Package   	: com.fanglin.service
 * @Version		: 1.0
 * @Date			: 2014-8-8
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.common.service;

import java.util.List;

import com.fanglin.common.vo.BuildingNameRuleVO;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.utils.Paging;


public interface BuildingNameRuleService {
	
	public void saveOrUpdateBuildNameRule(BuildingNameRuleVO buildingNameRuleVO);
	
	public void queryBuildNameRulePage(Paging paging, List<FilterVO> filters);
	
	public List<BuildingNameRuleVO> queryBuildNameRule();
	
	public BuildingNameRuleVO queryBuildingNameRuleById(int id);
	
	public void deleteBuildingNameRule(BuildingNameRuleVO buildingNameRuleVO);
	
	public void deleteBuildNameRuleById(int id);

}
