package com.fanglin.customer.service;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.vo.CppointVO;

public interface CppointService {

	public CppointVO queryCppoint(CppointVO cppointVO);

	public CppointVO createCppoint(CppointVO cppointVO, int company) throws FLException;

	public CppointVO addupCppoint(CppointVO cppointVO, String userId) throws FLException;

	public CppointVO useupCppoint(CppointVO cppointVO, String userId) throws FLException;

}
