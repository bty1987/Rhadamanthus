package com.fanglin.decoration.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.vo.AuditVO;
import com.fanglin.utils.Paging;

public interface AuditService {
	
	public List<AuditVO> pageAudit(Paging paging, List<Filter> filters);

	public void applyAudit(AuditVO auditVO,String UserId)throws FLException;
	
}
