/**
 * @File Name		: ConstructionScheduleWorkerService.java
 * @Package   	: com.fanglin.construction.service
 * @Version		: 1.0
 * @Date			: 2015-8-14
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service;

import java.util.List;
import java.util.Map;

import com.fanglin.construction.vo.ConstructionScheduleVO;
import com.fanglin.construction.vo.ConstructionScheduleWorkerVO;

public interface ConstructionScheduleWorkerService {
	
	public Map<String, List<ConstructionScheduleWorkerVO>> queryConstructionScheduleWorkerByOrderId(ConstructionScheduleVO constructionScheduleVO);

}
