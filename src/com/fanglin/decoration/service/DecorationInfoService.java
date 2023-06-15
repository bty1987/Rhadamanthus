package com.fanglin.decoration.service;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.vo.DecorationInfoVO;
import com.fanglin.decoration.vo.DecorationVO;

public interface DecorationInfoService {

	public DecorationInfoVO queryDecorationInfoByOrderId(String orderId);

	public void sendDecorationInfoForConfirm(DecorationInfoVO decorationInfoVO);

	public void confirmDecorationInfo(DecorationVO decorationVO, DecorationInfoVO decorationInfoVO) throws FLException;

}
