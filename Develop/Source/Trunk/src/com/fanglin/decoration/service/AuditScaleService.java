/**
 * @File Name		: AddReduceItemService.java
 * @Package   	: com.fanglin.decoration.service
 * @Version		: 1.0
 * @Date			: 2016-6-11
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.vo.AuditScaleVO;


public interface AuditScaleService {
	
	public List<AuditScaleVO> queryAudtiScaleByArid(AuditScaleVO auditScale);

	public int makeAuditScale(List<AuditScaleVO> auditScales, String userId) throws FLException;
	
	public int addAudtiScale(AuditScaleVO auditScale, String userId)throws FLException;
	
	public int updateAudtiScaleForStatus(AuditScaleVO auditScale) throws FLException;
	
	public int deleteAudtiScale(AuditScaleVO auditScale) throws FLException;
	
}
