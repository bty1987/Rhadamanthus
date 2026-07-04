package com.fanglin.decoration.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.vo.DecorationAuditVO;
import com.fanglin.utils.Paging;

public interface DecorationAuditService {

	public List<DecorationAuditVO> pageDecorationAudit(Paging paging, List<Filter> filters, int company);

	public void applyDecorationAudit(DecorationAuditVO auditVO,String UserId)throws FLException;

}
