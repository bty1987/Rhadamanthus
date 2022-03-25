package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.vo.VrecordVO;

public interface VrecordService {

	public List<VrecordVO> queryVrecordByVid(VrecordVO vrecordVO);

	public void addVrecord(VrecordVO vrecordVO, String userId) throws FLException;

}
