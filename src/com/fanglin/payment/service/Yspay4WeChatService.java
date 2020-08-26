package com.fanglin.payment.service;

import java.io.FileNotFoundException;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.payment.vo.Yspayment4NotifyVO;
import com.fanglin.payment.vo.Yspayment4WeChatVO;
import com.fanglin.payment.vo.YspaymentVO;

public interface Yspay4WeChatService {
	
	public Yspayment4WeChatVO makeYsPayment(YspaymentVO yspayment) throws FLException, FileNotFoundException ;

	public void updatePayment(Yspayment4NotifyVO yspayment4Notify) throws FLException;

}
