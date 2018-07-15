package com.fanglin.payment.service;

import java.util.List;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.vo.AdvanceReceiptVO;
import com.fanglin.payment.vo.ServicePaymentVO;
import com.fanglin.payment.vo.ServiceReceiptVO;
import com.fanglin.utils.Paging;

public interface ServicePaymentService {
	
	public void pageServicePaymentForCollect(Paging paging, List<Filter> filters);
	
	public void pageServicePaymentForConfirm(Paging paging, List<Filter> filters);
	
	public List<ServicePaymentVO> queryServicePaymentByOrderId(ServicePaymentVO ServicePaymentVO);
	
	public List<ServicePaymentVO> queryServicePaymentForNotInitBySrId(ServiceReceiptVO serviceReceiptVO);
	
	public int collectServicePayment(ServicePaymentVO servicePaymentVO,ServiceReceiptVO serviceReceiptVO,AdvanceReceiptVO advanceReceiptVO,String cuid) throws FLException;
	
	public int collectServicePaymentForService(ServicePaymentVO servicePaymentVO,ServiceReceiptVO serviceReceiptVO, String userId) throws FLException;
	
	public int refundServicePaymentForService(ServicePaymentVO servicePaymentVO,ServiceReceiptVO serviceReceiptVO, String userId) throws FLException;
	
	public int confirmServicePayment(List<Long> spids,String userId) throws FLException;
	
}
