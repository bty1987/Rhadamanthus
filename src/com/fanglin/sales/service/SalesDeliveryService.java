package com.fanglin.sales.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.vo.SalesDeliveryItemVO;
import com.fanglin.utils.Paging;

public interface SalesDeliveryService {

	public void pageSalesDeliveryItem(Paging paging, List<Filter> filters, int company, List<Short> statuses) throws FLException;

	public void pageSalesDeliveryItemForSupplier(Paging paging, List<Filter> filters, String userId, int company) throws FLException;

	public void pageSalesDeliveryItemForInstorer(Paging paging, List<Filter> filters, String userId, int company) throws FLException;

	public List<SalesDeliveryItemVO> querySalesDeliveryItem(SalesDeliveryItemVO salesDeliveryItemVO);

	public void tranSalesDeliveryItem(List<SalesDeliveryItemVO> salesDeliveryItems, String userId) throws FLException;

	public void checkSalesDeliveryItem(List<SalesDeliveryItemVO> salesDeliveryItems, String userId) throws FLException;

	public void confirmSalesDeliveryItem(List<SalesDeliveryItemVO> salesDeliveryItems, String userId) throws FLException;

	public void finishSalesDeliveryItem(List<SalesDeliveryItemVO> salesDeliveryItems, String userId) throws FLException;

	public void deliveSalesDeliveryItem(SalesDeliveryItemVO salesDeliveryItem, String queryUserId) throws FLException;

	public void updateSalesDeliveryItem(SalesDeliveryItemVO salesDeliveryItem) throws FLException;

}
