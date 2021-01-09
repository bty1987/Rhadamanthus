package com.fanglin.sales.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.vo.SalesDeliveryItemVO;
import com.fanglin.utils.Paging;

public interface SalesDeliveryService {

	public void pageSalesDeliveryItem(Paging paging, List<Filter> filters, int company, SalesDeliveryItemVO salesDeliveryItem);

	public void pageSalesDeliveryItemForSupplier(Paging paging, List<Filter> filters, String userId, int company);

	public void tranSalesDeliveryItem(SalesDeliveryItemVO salesDeliveryItem, String userId) throws FLException;

	public void checkSalesDeliveryItem(SalesDeliveryItemVO salesDeliveryItem, String userId) throws FLException;

	public void confirmSalesDeliveryItem(SalesDeliveryItemVO salesDeliveryItem, String userId) throws FLException;

	public void finishSalesDeliveryItem(SalesDeliveryItemVO salesDeliveryItem, String userId) throws FLException;

	public void deliveSalesDeliveryItem(SalesDeliveryItemVO salesDeliveryItem,String queryUserId) throws FLException;

	public void updateSalesDeliveryItem(SalesDeliveryItemVO salesDeliveryItem) throws FLException;

}
