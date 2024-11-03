package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.ConstructionPeriodVO;
import com.fanglin.utils.Paging;

public interface ConstructionPeriodService {

	public void pageConstructionPeriod(Paging paging, List<Filter> filters, int queryCompany) throws FLException;

	public int addConstructionPeriod(ConstructionPeriodVO constructionPeriod, int company);

	public int updateConstructionPeriod(ConstructionPeriodVO constructionPeriod);

	public int deleteConstructionPeriod(ConstructionPeriodVO constructionPeriod);

}
