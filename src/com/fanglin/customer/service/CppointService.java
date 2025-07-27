package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.CppointVO;
import com.fanglin.utils.Paging;

public interface CppointService {

	public void pageCppoint(Paging paging, List<Filter> filters);

	public CppointVO queryCppoint(CppointVO cppointVO);

	public CppointVO createCppoint(CppointVO cppointVO, int company) throws FLException;

	public CppointVO addupCppoint(CppointVO cppointVO, String userId) throws FLException;

	public CppointVO useupCppoint(CppointVO cppointVO, String userId) throws FLException;

}
