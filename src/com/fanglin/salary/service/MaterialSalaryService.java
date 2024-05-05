package com.fanglin.salary.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.salary.vo.MaterialSalaryVO;
import com.fanglin.utils.Paging;

public interface MaterialSalaryService {

	public void pageMaterialSalary(Paging paging, List<Filter> filters, MaterialSalaryVO materialSalaryVO) throws FLException;

}
