package com.fanglin.payment.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.bean.Wxpay;
import com.fanglin.payment.vo.PaytranVO;
import com.fanglin.utils.Paging;

public interface PaytranService {

	public void pagePaytran(Paging paging, List<Filter> filters);

	public List<PaytranVO> queryPaytran(PaytranVO paytran);

	public PaytranVO queryPaytranByPtid(PaytranVO paytran);

	public void sendPaytran(PaytranVO paytran) throws FLException;

	public void addPaytran(PaytranVO paytran, String userId, int company) throws FLException;

	public void checkPaytran(PaytranVO paytran, String userId, int company) throws FLException;

	public void cancelPaytran(PaytranVO paytran, int company) throws FLException;

	public void updatePaytran(List<Long> ptids, Long rid, Short status, Short type) throws FLException;

	public void deletePaytran(PaytranVO paytran) throws FLException;

	public void wxpay(Wxpay wxpay) throws FLException;

	public void pospay(PaytranVO paytran, int company) throws FLException;

	public void codepay(PaytranVO paytran) throws FLException;

}
