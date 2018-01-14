package com.fanglin.decoration.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.vo.AuditRecordVO;

public interface AuditRecordService {

	public List<AuditRecordVO> queryAuditRecordByOrderId(AuditRecordVO auditRecord) throws FLException;
	
	public int addAuditRecord(AuditRecordVO auditRecord,String userId) throws FLException;
	
	public int updateAuditRecord(AuditRecordVO auditRecord) throws FLException;

}
