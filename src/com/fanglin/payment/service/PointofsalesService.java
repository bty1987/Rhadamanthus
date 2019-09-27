package com.fanglin.payment.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.payment.vo.PointofsalesVO;

public interface PointofsalesService {

	public List<PointofsalesVO> queryPointofsalesByPid(PointofsalesVO pointofsales);

	public void addPointofsales(PointofsalesVO pointofsales, String userId) throws FLException;

	public void checkPointofsales(PointofsalesVO pointofsales) throws FLException;

	public void cancelPointofsales(PointofsalesVO pointofsalesVO) throws FLException;

}
