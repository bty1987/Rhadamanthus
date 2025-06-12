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
import com.fanglin.core.interceptor.FLException;

public interface AcceptanceService {

	public AcceptanceVO queryAcceptanceById(AcceptanceVO acceptanceVO);

	public AcceptanceVO queryAcceptanceByOrderId(AcceptanceVO acceptanceVO) throws FLException;

	public int updateAcceptance(AcceptanceVO acceptanceVO) throws FLException;

}
