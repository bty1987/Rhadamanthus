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

package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.BuildingNameRuleVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface BuildingNameRuleService {

	public void pageBuildingNameRule(Paging paging, List<Filter> filters);

	public List<BuildingNameRuleVO> queryBuildNameRule();

	public void saveOrUpdateBuildNameRule(BuildingNameRuleVO buildingNameRuleVO);

	public void deleteBuildingNameRule(BuildingNameRuleVO buildingNameRuleVO);

	public void deleteBuildNameRuleById(int id);

}
