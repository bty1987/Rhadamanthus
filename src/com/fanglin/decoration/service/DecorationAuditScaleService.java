/**
 * @File Name		: DecorationAuditScaleService.java
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
import com.fanglin.decoration.vo.DecorationAuditScaleVO;


public interface DecorationAuditScaleService {

	public List<DecorationAuditScaleVO> queryDecorationAuditScaleByArid(DecorationAuditScaleVO auditScale);

	public int makeDecorationAuditScale(List<DecorationAuditScaleVO> auditScales, String userId) throws FLException;

	public int addDecorationAuditScale(DecorationAuditScaleVO auditScale, String userId)throws FLException;

	public int updateDecorationAuditScaleForStatus(DecorationAuditScaleVO auditScale) throws FLException;

	public int deleteDecorationAuditScale(DecorationAuditScaleVO auditScale) throws FLException;

}
