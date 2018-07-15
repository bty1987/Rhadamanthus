package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.VrecordVO;
import com.fanglin.core.interceptor.FLException;

public interface VrecordService {
	
	public List<VrecordVO> queryVrecordByVid(VrecordVO vrecordVO);
	
	public void addVrecord(VrecordVO vrecordVO, String userId) throws FLException;
	
}
