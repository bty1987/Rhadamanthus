/**
 * @File Name	: AcceptanceService.java
 * @Package   	: com.fanglin.service.constructionSchedule
 * @Version		: 1.0
 * @Date		: 2014-9-26
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service;

import java.util.List;

import com.fanglin.construction.vo.ConstructionPlanVO;
import com.fanglin.core.interceptor.FLException;

public interface ConstructionPlanService {

	public List<ConstructionPlanVO> queryConstructionPlanByOrderId(ConstructionPlanVO constructionPlanVO) throws FLException;

	public void addConstructionPlan(ConstructionPlanVO constructionPlanVO) throws FLException;

	public void deleteConstructionPlan(ConstructionPlanVO constructionPlanVO) throws FLException;
}
