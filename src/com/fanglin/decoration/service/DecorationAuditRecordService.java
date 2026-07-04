package com.fanglin.decoration.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.vo.DecorationAuditRecordVO;

public interface DecorationAuditRecordService {

	public List<DecorationAuditRecordVO> queryDecorationAuditRecordByOrderId(DecorationAuditRecordVO auditRecord) throws FLException;

	public int addDecorationAuditRecord(DecorationAuditRecordVO auditRecord,String userId) throws FLException;

	public int updateDecorationAuditRecord(DecorationAuditRecordVO auditRecord) throws FLException;

}
