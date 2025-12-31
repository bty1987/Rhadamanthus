package com.fanglin.decoration.service;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.vo.DecorationInfoVO;
import com.fanglin.decoration.vo.DecorationVO;

public interface DecorationInfoService {

	public DecorationInfoVO queryDecorationInfoByOrderId(DecorationInfoVO decorationInfoVO);

	public DecorationInfoVO queryDecorationInfoForCustomer(DecorationInfoVO decorationInfoVO);

	public void sendDecorationInfoForConfirm(DecorationInfoVO decorationInfoVO, String userId);

	public void confirmDecorationInfo(DecorationVO decorationVO, DecorationInfoVO decorationInfoVO, String securityCode, String verifyCode, String phoneCode, String company) throws FLException;

	public int referDecorationInfo(DecorationVO decorationVO, DecorationInfoVO decorationInfoVO) throws FLException;

	public int deleteReferDecorationInfo(DecorationVO decorationVO, DecorationInfoVO decorationInfoVO) throws FLException;
}
