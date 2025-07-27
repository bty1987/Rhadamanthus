package com.fanglin.sales.service;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.sales.vo.SalesProfileVO;

public interface SalesProfileService {

	public SalesProfileVO querySalesProfileByOrderId(SalesProfileVO salesProfileVO) throws FLException;

	public SalesProfileVO makeSalesProfile(SalesProfileVO salesProfileVO, String userId, int company) throws FLException;

	public void handleSalesProfile(SalesProfileVO salesProfileVO) throws FLException;

	public void addSalesProfileBrand(SalesProfileVO salesProfileVO) throws FLException;

	public void updateSalesProfileBrand(SalesProfileVO salesProfileVO) throws FLException;

}
