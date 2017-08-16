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

import com.fanglin.construction.vo.AcceptanceVO;

public interface AcceptanceService {
	
	public AcceptanceVO queryAcceptanceById(int actId);
	
	public AcceptanceVO queryAcceptanceByOrderId(AcceptanceVO acceptanceVO);
	
	public void saveOrUpdateAcceptance(AcceptanceVO acceptanceVO);

}
