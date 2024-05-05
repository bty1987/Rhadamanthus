package com.fanglin.salary.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.salary.vo.DecorationSalaryVO;
import com.fanglin.utils.Paging;

public interface DecorationSalaryService {

	public void pageDecorationSalary(Paging paging, List<Filter> filter, DecorationSalaryVO decorationSalaryVO) throws FLException;

}
