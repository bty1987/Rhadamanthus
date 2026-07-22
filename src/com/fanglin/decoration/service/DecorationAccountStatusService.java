package com.fanglin.decoration.service;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.po.DecorationAccountStatusPO;
import com.fanglin.decoration.vo.DecorationAccountStatusVO;

public interface DecorationAccountStatusService {

	public DecorationAccountStatusVO queryDecorationAccountStatusByOrderId(DecorationAccountStatusVO decorationAccountStatusVO);

	public DecorationAccountStatusPO updateDecorationAccountStatus(String orderId) throws FLException;

	public void updateDecorationAccountStatus(String orderId, short type) throws FLException;

	public void checkDecorationAccountStatus(String orderId, int company) throws FLException;

}
