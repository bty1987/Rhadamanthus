package com.fanglin.payment.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.vo.PointofsalesVO;
import com.fanglin.utils.Paging;

public interface PointofsalesService {

	public void pagePointofsales(Paging paging, List<Filter> filters);

	public List<PointofsalesVO> queryPointofsales(PointofsalesVO pointofsales);

	public void addPointofsales(PointofsalesVO pointofsales, String userId) throws FLException;

	public void checkPointofsales(PointofsalesVO pointofsales) throws FLException;

	public void cancelPointofsales(PointofsalesVO pointofsalesVO) throws FLException;
	
	public void updatePointofsales(List<Long> posids, Long rid, Short status, Short type) throws FLException;

}
