package com.fanglin.information.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.vo.AwardPurchaseVO;
import com.fanglin.utils.Paging;

public interface AwardPurchaseService {

	public void pageAwardPurchase(Paging paging, List<Filter> filters, AwardPurchaseVO awardPurchase, int company);

	public void addAwardPurchase(AwardPurchaseVO awardPurchaseVO, String userId, int company) throws FLException;

	public void purchaseAwardPurchase(AwardPurchaseVO awardPurchase, String userId) throws FLException;

	public void instoreAwardPurchase(AwardPurchaseVO awardPurchase, String userId) throws FLException;

	public void balanceAwardPurchase(AwardPurchaseVO awardPurchase, String userId) throws FLException;

}
