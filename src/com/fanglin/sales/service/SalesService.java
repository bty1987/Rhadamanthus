package com.fanglin.sales.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.po.SalesPO;
import com.fanglin.sales.vo.SalesItemVO;
import com.fanglin.sales.vo.SalesVO;
import com.fanglin.utils.Paging;

public interface SalesService {

	public void pageSales(Paging paging, List<Filter> filter, String userId, int company) throws FLException;

	public List<SalesVO> pageSales(List<SalesPO> salesPOs);

	public void pageSalesForAdvance(Paging paging, List<Filter> filter, String userId, int company) throws FLException;

	public void pageSalesForBalance(Paging paging, List<Filter> filter, String userId, int company) throws FLException;

	public void pageSalesForDompany(Paging paging, List<Filter> filter, String userId, int dompany) throws FLException;

	public void pageSalesForBalanceByDompany(Paging paging, List<Filter> filter, String userId, int dompany) throws FLException;

	public void pageSalesForPompany(Paging paging, List<Filter> filter, String userId, int pompany) throws FLException;

	public void pageSalesForBalanceByPompany(Paging paging, List<Filter> filter, String userId, int pompany) throws FLException;

	public void pageSalesForSupplier(Paging paging, List<Filter> filter, String userId, int company) throws FLException;

	public void pageSalesByOrderId(Paging paging, List<Filter> filter, int company, String userId, String orderId);

	public List<SalesVO> querySalesByOrderId(SalesVO salesVO);

	public SalesVO querySalesBySid(SalesVO salesVO) throws FLException;

	public SalesVO querySalesByNo(SalesVO salesVO) throws FLException;

	public long amountSales(SalesVO salesVO) throws FLException;

	public int checkSales(SalesVO salesVO) throws FLException;

	public int addSales(SalesVO salesVO, List<SalesItemVO> salesItemVOs, String userId, int company) throws FLException;

	public int updateSales(SalesVO salesVO) throws FLException;

	public int updateSalesForCoupon(SalesVO salesVO) throws FLException;

	public int updateSalesForMaling(SalesVO salesVO) throws FLException;

	public int updateSalesForActivity(SalesVO salesVO) throws FLException;

	public int updateSalesForBelong(SalesVO salesVO) throws FLException;

	public int updateSalesForAdvance(SalesVO salesVO) throws FLException;

	public int unpaySales(SalesVO salesVO, String userId) throws FLException;

	public int sendSales(SalesVO salesVO, String userId) throws FLException;

	public int affirmSales(SalesVO salesVO, String securityCode, String verifyCode, String phoneCode, String company) throws FLException;

	public int terminalSales(SalesVO salesVO) throws FLException;

	public int finishSales(SalesVO salesVO, String userId) throws FLException;

}
