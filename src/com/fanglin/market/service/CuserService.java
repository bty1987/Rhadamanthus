package com.fanglin.market.service;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.market.vo.CuserVO;

public interface CuserService {

	public CuserVO queryCuserByUnionId(CuserVO cuser);
	
	public void addCuser(CuserVO cuserVO) throws FLException;
}
