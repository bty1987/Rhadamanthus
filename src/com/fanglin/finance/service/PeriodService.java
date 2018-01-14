/**
 * @File Name		: PeriodService.java
 * @Package   	: com.fanglin.finance.service
 * @Version		: 1.0
 * @Date			: 2016-4-18
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.service;

import java.util.List;

import com.fanglin.finance.vo.PeriodVO;

public interface PeriodService {
	
	public List<PeriodVO> queryPeriod();
	
	public PeriodVO queryPeriodForCurrent();
	
	public List<PeriodVO> queryPeriodForOpen();

}
