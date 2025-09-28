package com.fanglin.balance.service;

import java.util.List;

import com.fanglin.balance.vo.BalancePictureVO;
import com.fanglin.core.interceptor.FLException;

public interface BalancePictureService {

	public List<BalancePictureVO> queryBalancePicture(BalancePictureVO balancePictureVO);

	public int addBalancePicture(BalancePictureVO balancePictureVO, String userId, int company) throws FLException;

	public int deleteBalancePicture(BalancePictureVO balancePictureVO);

}
