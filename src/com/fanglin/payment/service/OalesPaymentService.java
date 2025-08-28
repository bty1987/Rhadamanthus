package com.fanglin.payment.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.vo.OalesPaymentVO;
import com.fanglin.payment.vo.OalesReceiptVO;
import com.fanglin.utils.Paging;

public interface OalesPaymentService {

	public void pageOalesPayment(Paging paging, List<Filter> filters, OalesPaymentVO oalesPaymentVO, int company, String companyType) throws FLException;

	public List<OalesPaymentVO> queryOalesPaymentByOid(OalesPaymentVO oalesPaymentVO);

	public List<OalesPaymentVO> queryOalesPaymentByOrderId(OalesPaymentVO oalesPaymentVO, List<Filter> filters, int company, String companyType) throws FLException;

	public List<OalesPaymentVO> queryOalesPaymentForNotInitByOrid(OalesReceiptVO oalesReceipt);

	public OalesPaymentVO queryOalesPaymentByOpid(OalesPaymentVO oalesPayment);

	public int addOalesPayment(OalesPaymentVO oalesPaymentVO, String userId, int company) throws FLException;

	public int collectOalesPayment(OalesPaymentVO oalesPaymentVO, OalesReceiptVO oalesReceiptVO, List<Long> ptids, String userId, Integer company) throws FLException;

	public int refundOalesPayment(OalesPaymentVO oalesPaymentVO, OalesReceiptVO oalesReceiptVO, String userId, Integer company) throws FLException;

	public int confirmOalesPayment(List<Long> opids, String userId) throws FLException;

	public int cancelOalesPayment(OalesPaymentVO oalesPaymentVO) throws FLException;

	public void updateOalesPayment(OalesPaymentVO oalesPayment, OalesReceiptVO oalesReceipt) throws FLException;

}
