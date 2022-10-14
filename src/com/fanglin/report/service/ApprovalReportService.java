package com.fanglin.report.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ApprovalReportService {

	public void queryApproval7Achievement(Paging paging, List<Filter> filters, int company) throws FLException;

}
