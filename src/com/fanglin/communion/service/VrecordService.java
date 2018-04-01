package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.VrecordVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;

public interface VrecordService {
	
	public List<VrecordVO> queryVrecordByVid(List<Filter> filters);
	
	public void addVrecord(VrecordVO vrecordVO, String userId) throws FLException;
	
}
