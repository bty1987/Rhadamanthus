package com.fanglin.payment.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface StatementService {

	public void pageStatement(Paging paging, List<Filter> filters);

}
