package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.DecorationBusitypeVO;
import com.fanglin.utils.Paging;

public interface DecorationBusitypeService {

	public void pageDecorationBusitype(Paging paging, List<Filter> filters, int company);

	public List<DecorationBusitypeVO> queryDecorationBusitype(int company);

	public int addDecorationBusitype(DecorationBusitypeVO decorationBusitypeVO, int company) throws FLException;

	public void updateDecorationBusitypeForStatus(DecorationBusitypeVO decorationBusitypeVO) throws FLException;

	public void updateDecorationBusitype(DecorationBusitypeVO decorationBusitypeVO) throws FLException;
}
