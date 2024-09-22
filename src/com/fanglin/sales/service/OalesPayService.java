package com.fanglin.sales.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.vo.OalesPayVO;
import com.fanglin.utils.Paging;

public interface OalesPayService {

	public void pageOalesPay(Paging paging, List<Filter> filters, int company) throws FLException;

	public List<OalesPayVO> queryOalesPay(OalesPayVO oalesPayVO);

	public int addOalesPay(OalesPayVO oalesPayVO, String userId, int company) throws FLException;

	public int updateOalesPay(OalesPayVO oalesPayVO) throws FLException;

	public int updateOalesPayForAdvance(OalesPayVO oalesPay) throws FLException;

	public int deleteOalesPay(OalesPayVO oalesPayVO) throws FLException;

}
