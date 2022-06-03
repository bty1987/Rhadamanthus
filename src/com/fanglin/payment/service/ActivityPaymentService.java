package com.fanglin.payment.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.vo.ActivityPaymentVO;
import com.fanglin.payment.vo.ActivityReceiptVO;
import com.fanglin.utils.Paging;

public interface ActivityPaymentService {

	public void pageActivityPayment(Paging paging, List<Filter> filters, ActivityPaymentVO activityPaymentVO);

	public List<ActivityPaymentVO> queryActivityPaymentByNo(ActivityPaymentVO activityPaymentVO);

	public List<ActivityPaymentVO> queryActivityPaymentByArid(ActivityPaymentVO activityPaymentVO);

	public int createActivityPayment(ActivityPaymentVO activityPaymentVO, String usreId) throws FLException;

	public int collectActivityPayment(List<ActivityPaymentVO> activityPayments, ActivityReceiptVO activityReceiptVO, List<Long> ptids, String userId) throws FLException;

	public int deleteActivityPaymentId(ActivityPaymentVO activityPaymentVO);

	public List<List<String>> countActivityPayment();

}
