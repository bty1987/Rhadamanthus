package com.fanglin.report.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface PutlineService {

	public void pagePutline (Paging paging, List<Filter> filters);

}
