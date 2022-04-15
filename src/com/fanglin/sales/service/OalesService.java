package com.fanglin.sales.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.vo.OalesVO;
import com.fanglin.utils.Paging;

public interface OalesService {

	public void pageOales(Paging paging, List<Filter> filters, int company) throws FLException;

	public List<OalesVO> queryOalesByOrderId(OalesVO oalesVO);

	public void addOales(OalesVO oalesVO, String userId, int company) throws FLException;

	public void updateOales(OalesVO oalesVO) throws FLException;

	public void confirmOales(OalesVO oalesVO) throws FLException;

	public void rejectOales(OalesVO oalesVO, String userId) throws FLException;

	public void checkOales(OalesVO oalesVO) throws FLException;

	public void finishOales(OalesVO oalesVO) throws FLException;

	public void deleteOales(OalesVO oalesVO) throws FLException;

}
