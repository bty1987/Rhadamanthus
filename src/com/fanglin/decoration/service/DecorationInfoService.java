package com.fanglin.decoration.service;

import com.fanglin.decoration.vo.DecorationInfoVO;

public interface DecorationInfoService {

	public DecorationInfoVO queryDecorationInfoByOrderId(String orderId);

	public void sendDecorationInfoForConfirm(DecorationInfoVO decorationInfoVO);

	public void confirmDecorationInfo(DecorationInfoVO decorationInfoVO);

}
